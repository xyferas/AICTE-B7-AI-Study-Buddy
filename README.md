# 📚 AI Study Buddy + Voice Notes

A professional, AI-powered learning copilot designed to help students transcribe lectures, summarize notes, generate interactive quizzes, and plan study schedules.

## 🚀 Features

- **💬 AI Chat Assistant**: Ask study questions and get tiered explanations (Beginner, Intermediate, Advanced).
- **📝 Notes Summarizer**: Paste long-form notes and get concise, structured summaries. Download as text.
- **🎤 Voice to Notes**: Upload lecture audio for high-fidelity transcription and auto-summarization.
- **🧠 Quiz Generator**: Instantly create Multiple Choice Questions from your study materials with interactive grading.
- **📅 Study Planner**: Generate a custom, balanced study schedule based on your subjects and deadlines.
- **💾 Saved Content**: Securely store your generated summaries, notes, and plans in your personal dashboard.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Backend**: FastAPI, Python, SQLite, SQLAlchemy, JWT Authentication
- **AI Models**: Google Gemini 2.5 Flash, Hugging Face (Whisper Large V3)

---

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd AI-StudyBuddy
   ```

2. **Backend Setup**:
   Open a terminal and navigate to the `backend` directory.
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Frontend Setup**:
   Open a separate terminal and navigate to the `frontend` directory.
   ```bash
   cd frontend
   npm install
   ```

---

## 🔑 Environment Variables

The application requires API keys and a secret key for JWT authentication. Create a `.env` file in the `backend/` directory and add the following:

```env
# AI API Keys
GEMINI_API_KEY=your_gemini_key_here
HF_TOKEN=your_huggingface_token_here

# JWT Authentication
SECRET_KEY=your_secure_random_string_here
ALGORITHM=HS256

# Optional: Hugging Face Model selection
HF_ASR_MODEL=openai/whisper-large-v3
HF_PROVIDER=fal-ai
```

---

## 🏃 Running the App Locally

To run the application, you need to start both the backend and frontend development servers.

1. **Start the Backend (FastAPI)**:
   In your `backend` terminal, run:
   ```bash
   uvicorn main:app --reload
   ```
   *The API will be available at `http://localhost:8000`*

2. **Start the Frontend (React)**:
   In your `frontend` terminal, run:
   ```bash
   npm run dev
   ```
   *The React app will be available at `http://localhost:5173`*

---

## 🚀 Deployment

The architecture is split into a frontend and a backend, allowing for flexible deployment options.
- **Backend**: Can be deployed to platforms like Render, Railway, or Heroku as a Python web service running Uvicorn.
- **Frontend**: Can be easily deployed as a static site to Vercel or Netlify.

*Note: For production, ensure you update CORS origins in FastAPI (`main.py`) and API Base URLs in React (`axios` requests).*
