import json
import os
import re

from google import genai
from dotenv import load_dotenv

# Load keys from .env if present
load_dotenv()

def get_api_key(name):
    """Retrieve API key from environment or streamlit secrets."""
    return os.getenv(name) 

client = genai.Client(api_key=get_api_key("GEMINI_API_KEY"))

STUDY_ONLY_MESSAGE = "This is for study purposes only."

def generate_flashcards(text: str = "", topic: str = ""):
    source = (text or "").strip()
    topic_clean = (topic or "").strip()

    if not source and not topic_clean:
        return {"error": "Please provide either study text or a study topic to generate flashcards."}

    basis = (
        f"Topic: {topic_clean}"
        if topic_clean and not source
        else f"Text:\n{source}"
        if source and not topic_clean
        else f"Topic: {topic_clean}\n\nText:\n{source}"
    )

    prompt = f"""You are a flashcard generator for study material only. If the given input is NOT educational or study-related, respond with exactly this JSON and nothing else (no markdown, no code block):
{{"study_only": true, "message": "This is for study purposes only."}}

Otherwise, generate exactly 10 flashcards based on the material. Each flashcard should have a 'front' (a concept, term, or question) and a 'back' (the definition, explanation, or answer). Keep the text concise and easy to read quickly.
Return ONLY valid JSON in this exact shape (no markdown, no code fence):
{{"flashcards": [
  {{"front": "Question or Term here", "back": "Answer or Definition here"}},
  ...
]}}

Input:
{basis}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
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

    flashcards = data.get("flashcards") or []
    if not flashcards:
        return {"error": "No flashcards were generated."}

    return {"flashcards": flashcards}
