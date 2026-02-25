# 📚 AI Study Buddy + Voice Notes

A professional, AI-powered learning copilot designed to help students transcribe lectures, summarize notes, generate interactive quizzes, and plan study schedules.

## 🚀 Features

- **💬 AI Chat Assistant**: Ask study questions and get tiered explanations (Beginner, Intermediate, Advanced).
- **📝 Notes Summarizer**: Paste long-form notes and get concise, structured summaries.
- **🎤 Voice to Notes**: Upload or record lecture audio for high-fidelity transcription and auto-summarization.
- **🧠 Quiz Generator**: Instantly create Multiple Choice Questions from your study materials.
- **📅 Study Planner**: Generate a custom, balanced study schedule based on your subjects and deadlines.

---

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd AI-StudyBuddy
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Install FFmpeg** (Required for audio processing):
   - **Windows**: `pip install ffmpeg-python` and ensure FFmpeg is in your PATH.
   - **macOS**: `brew install ffmpeg`
   - **Linux**: `sudo apt install ffmpeg`

---

## 🔑 API Key Configuration

The application requires API keys for **Google Gemini** and **Hugging Face**. You can configure them in two ways:

### Option 1: Using `.env` (Recommended for Local Dev)
Create a `.env` file in the root directory and add:
```env
GEMINI_API_KEY=your_gemini_key_here
HF_TOKEN=your_huggingface_token_here

# Optional: Model selection
HF_ASR_MODEL=openai/whisper-large-v3
HF_PROVIDER=fal-ai
```

### Option 2: Using Streamlit Secrets (Recommended for Deployment)
If you prefer using Streamlit's native configuration, create a file at `.streamlit/secrets.toml` and add:
```toml
GEMINI_API_KEY = "your_gemini_key_here"
HF_TOKEN = "your_huggingface_token_here"

# Optional: Model selection
HF_ASR_MODEL = "openai/whisper-large-v3"
HF_PROVIDER = "fal-ai"
```

---

## 🏃 Running the App

After configuring your keys, run the application using:
```bash
streamlit run app.py
```

---
