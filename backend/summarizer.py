import os

from google import genai
from dotenv import load_dotenv

# Load keys from .env if present
load_dotenv()

def get_api_key(name):
    """Retrieve API key from environment or streamlit secrets."""
    return os.getenv(name) 

client = genai.Client(api_key=get_api_key("GEMINI_API_KEY"))

def summarize_text(text):
    prompt = f"""You are a strict academic note-taking assistant. You only process formal educational material (e.g. academia, sciences, math, programming, history, literature, medicine, business).

CRITICAL RULE: If the following text is about pop-culture, movies, television, entertainment, gaming, casual conversation, or ANY non-academic topic, you MUST reject it. 

If it violates this rule or is not clearly academic study material, respond with EXACTLY this sentence and nothing else:
This is for study purposes only.

Otherwise, if it strictly passes the rule, summarize the educational content into clear, well-structured study notes.

FORMATTING RULES:
1. Use '###' for main section headings.
2. Use '####' or bold text for sub-headings.
3. Use bullet points (-) for lists and ensure each point is on a new line.
4. Use proper spacing (newlines) between paragraphs and sections.
5. DO NOT use asterisks (*) as decorators or separators within a paragraph.
6. Use bold text for key terms only.
7. Ensure the output is clean and highly readable Markdown.

Text:
{text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return response.text
