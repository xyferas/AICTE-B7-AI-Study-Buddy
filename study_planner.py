import os
import streamlit as st
from datetime import date
from google import genai
from dotenv import load_dotenv

# Load keys from .env if present
load_dotenv()

def get_api_key(name):
    """Retrieve API key from environment or streamlit secrets."""
    return os.getenv(name) or (st.secrets.get(name) if name in st.secrets else None)

client = genai.Client(api_key=get_api_key("GEMINI_API_KEY"))

STUDY_ONLY_MESSAGE = "This is for study purposes only."


def generate_study_plan(
    topics: str,
    start_date: str = "",
    end_date: str = "",
    hours_per_day: str = "2",
    days_per_week: str = "7",
):
    """Generate a structured study plan. Topics must be study-related."""
    start = start_date or str(date.today())
    end = end_date or "Not specified"
    prompt = f"""You are a study planner. Only create plans for educational subjects and exam/learning goals.
If the topics given are NOT related to education or studying (e.g. hobbies, work tasks, non-academic), respond with exactly this sentence and nothing else: {STUDY_ONLY_MESSAGE}

Otherwise, create a clear, practical study plan with:
1. A short overview (2–3 sentences) of the plan.
2. A schedule from the start date to the end date (today → deadline). Use week-by-week or day-by-day depending on the timeframe, with:
   - What to study each period (specific topics/subtasks)
   - Suggested time per topic/session
   - Optional short tips (spaced repetition, practice problems, etc.)
3. A brief closing reminder (e.g. rest, review days).

User inputs:
- Topics or subjects to cover: {topics}
- Start date: {start}
- End date / deadline: {end}
- Hours available per day: {hours_per_day}
- Study days per week: {days_per_week}

Format the plan in clear sections with headings. Use bullet points and short paragraphs. Keep it actionable and realistic for the time given.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
    )

    return (response.text or "").strip()
