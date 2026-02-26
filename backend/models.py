from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    saved_contents = relationship("SavedContent", back_populates="user")

class SavedContent(Base):
    __tablename__ = "saved_contents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content_type = Column(String, index=True) # e.g., 'quiz', 'summary', 'plan', 'notes', 'chat'
    title = Column(String)
    content_data = Column(String) # JSON string or plain text
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_contents")
