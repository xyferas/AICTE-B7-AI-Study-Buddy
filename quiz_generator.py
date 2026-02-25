import json
import os
import re
import streamlit as st
from google import genai
from dotenv import load_dotenv

# Load keys from .env if present
load_dotenv()

def get_api_key(name):
    """Retrieve API key from environment or streamlit secrets."""
    return os.getenv(name) or (st.secrets.get(name) if name in st.secrets else None)

client = genai.Client(api_key=get_api_key("GEMINI_API_KEY"))

STUDY_ONLY_MESSAGE = "This is for study purposes only."


def generate_quiz(text: str = "", topic: str = ""):
    source = (text or "").strip()
    topic_clean = (topic or "").strip()

    if not source and not topic_clean:
        return {"error": "Please provide either study text or a study topic to generate a quiz."}

    basis = (
        f"Topic: {topic_clean}"
        if topic_clean and not source
        else f"Text:\n{source}"
        if source and not topic_clean
        else f"Topic: {topic_clean}\n\nText:\n{source}"
    )

    prompt = f"""You are a quiz generator for study material only. If the given input is NOT educational or study-related, respond with exactly this JSON and nothing else (no markdown, no code block):
{{"study_only": true, "message": "This is for study purposes only."}}

Otherwise, generate exactly 5 multiple-choice study questions based on the input. Return ONLY valid JSON in this exact shape (no markdown, no code fence):
{{"questions": [
  {{"question": "Question text?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct_index": 0, "explanation": "Short explanation of the correct answer."}},
  ...
]}}
- "correct_index" is the 0-based index of the correct option in "options" (0 = first, 1 = second, etc.).
- Each question must have 4 options and a short explanation.

Input:
{basis}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
    )
    raw = (response.text or "").strip()

    # Strip markdown code block if present
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```\s*$", "", raw)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return {"error": raw or "Invalid response from model."}

    if data.get("study_only"):
        return {"study_only": True, "message": data.get("message", STUDY_ONLY_MESSAGE)}

    questions = data.get("questions") or []
    if not questions:
        return {"error": "No questions were generated."}

    return {"questions": questions}
