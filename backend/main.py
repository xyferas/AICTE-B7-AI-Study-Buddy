from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import os
from pydantic import BaseModel
from typing import Optional, List

from database import engine, get_db, Base
from models import User, SavedContent
from auth import verify_password, get_password_hash, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES

import ai_chat
import summarizer
import quiz_generator
import speech_to_text
import study_planner

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Study Buddy API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class UserCreate(BaseModel):
    name: str = ""
    email: str
    password: str

class LoginData(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ChatRequest(BaseModel):
    question: str
    level: str = "Beginner"

class SummarizeRequest(BaseModel):
    text: str

class QuizRequest(BaseModel):
    text: str = ""
    topic: str = ""

class PlannerRequest(BaseModel):
    topics: str
    start_date: str = ""
    end_date: str = ""
    hours_per_day: str = "2"
    days_per_week: str = "7"

class SavedContentCreate(BaseModel):
    content_type: str
    title: str
    content_data: str

class SavedContentResponse(BaseModel):
    id: int
    content_type: str
    title: str
    content_data: str
    created_at: datetime
    
    class Config:
        from_attributes = True

def handle_api_error(e: Exception):
    error_str = str(e)
    if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str or "Quota exceeded" in error_str:
        raise HTTPException(status_code=429, detail="API Rate Limit Exceeded: You have exceeded your free tier quota. Please try again later or check your API keys.")
    raise HTTPException(status_code=500, detail=error_str)


@app.post("/api/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(name=user.name, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

@app.post("/api/login", response_model=Token)
def login(login_data: LoginData, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email, "name": current_user.name}

@app.post("/api/chat")
def chat(request: ChatRequest, current_user: User = Depends(get_current_user)):
    try:
        answer = ai_chat.study_chat(request.question, request.level)
        return {"answer": answer}
    except Exception as e:
        handle_api_error(e)

@app.post("/api/summarize")
def summarize(request: SummarizeRequest, current_user: User = Depends(get_current_user)):
    try:
        summary = summarizer.summarize_text(request.text)
        return {"summary": summary}
    except Exception as e:
        handle_api_error(e)

@app.post("/api/quiz")
def generate_quiz(request: QuizRequest, current_user: User = Depends(get_current_user)):
    try:
        result = quiz_generator.generate_quiz(request.text, request.topic)
        if "error" in result:
             raise HTTPException(status_code=400, detail=result["error"])
        return result
    except Exception as e:
        handle_api_error(e)

@app.post("/api/plan")
def plan(request: PlannerRequest, current_user: User = Depends(get_current_user)):
    try:
        plan_text = study_planner.generate_study_plan(
            topics=request.topics,
            start_date=request.start_date,
            end_date=request.end_date,
            hours_per_day=request.hours_per_day,
            days_per_week=request.days_per_week
        )
        return {"plan": plan_text}
    except Exception as e:
        handle_api_error(e)

@app.post("/api/transcribe")
async def transcribe(audio: UploadFile = File(...), model: str = Form(None), current_user: User = Depends(get_current_user)):
    try:
        # Wrap the file in a dummy object that has `.read()` and `.type` that speech_to_text.py expects
        class DummyFile:
            def __init__(self, file_content, c_type):
                self.content = file_content
                self.type = c_type
                self._pos = 0
            def read(self):
                return self.content
            def seek(self, pos):
                pass
                
        content = await audio.read()
        if len(content) > 10 * 1024 * 1024: # 10MB limit
            raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")
            
        dummy_file = DummyFile(content, audio.content_type)
        transcript = speech_to_text.transcribe_audio(dummy_file, model)
        return {"transcript": transcript}
    except Exception as e:
        handle_api_error(e)

@app.post("/api/saved-content", response_model=SavedContentResponse)
def save_content(request: SavedContentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        new_content = SavedContent(
            user_id=current_user.id,
            content_type=request.content_type,
            title=request.title,
            content_data=request.content_data
        )
        db.add(new_content)
        db.commit()
        db.refresh(new_content)
        return new_content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/saved-content", response_model=List[SavedContentResponse])
def get_saved_content(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        contents = db.query(SavedContent).filter(SavedContent.user_id == current_user.id).order_by(SavedContent.created_at.desc()).all()
        return contents
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/saved-content/{content_id}")
def delete_saved_content(content_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        content = db.query(SavedContent).filter(SavedContent.id == content_id, SavedContent.user_id == current_user.id).first()
        if not content:
            raise HTTPException(status_code=404, detail="Content not found")
        db.delete(content)
        db.commit()
        return {"message": "Content deleted successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
