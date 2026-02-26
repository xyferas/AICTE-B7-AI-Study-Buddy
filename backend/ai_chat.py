import os

from google import genai
from dotenv import load_dotenv

# Load keys from .env if present
load_dotenv()

def get_api_key(name):
    """Retrieve API key from environment or streamlit secrets."""
    return os.getenv(name) 

client = genai.Client(api_key=get_api_key("GEMINI_API_KEY"))

def study_chat(question, level="Beginner"):
    prompt = f"""You are a study assistant. Only answer questions about education, learning, or studying.
If the user's question is NOT related to education, learning, or studying, respond with exactly this sentence and nothing else: This is for study purposes only.

Otherwise, explain the following topic at {level} level in a clear and well-structured manner.

FORMATTING RULES:
1. Use '###' for main section headings.
2. Use bullet points (-) for lists and ensure each point is on a new line.
3. Use proper spacing (newlines) between paragraphs and sections.
4. DO NOT use asterisks (*) as decorators or separators within a paragraph.
5. Use bold text for key terms only.
6. Ensure the output is high-quality Markdown.

Topic:
{question}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return response.text
