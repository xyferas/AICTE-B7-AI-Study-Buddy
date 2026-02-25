import os
import streamlit as st

from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

DEFAULT_PROVIDER = os.getenv("HF_PROVIDER", "fal-ai")
DEFAULT_HF_ASR_MODEL = os.getenv("HF_ASR_MODEL", "openai/whisper-large-v3")


def transcribe_audio(uploaded_file, model: str | None = None) -> str:
    """
    Transcribe using Hugging Face Inference Providers via `huggingface_hub`.

    Required env:
      - HF_TOKEN (or HF_API_TOKEN)
    Optional env:
      - HF_PROVIDER (default: fal-ai)
      - HF_ASR_MODEL (default: openai/whisper-large-v3)
    """
    def get_api_key(name):
        return os.getenv(name) or (st.secrets.get(name) if name in st.secrets else None)

    token = get_api_key("HF_TOKEN") or get_api_key("HF_API_TOKEN") or get_api_key("HUGGINGFACEHUB_API_TOKEN")
    if not token:
        raise RuntimeError(
            "HF_TOKEN is missing. Create a Hugging Face access token and set it in your .env as HF_TOKEN=..."
        )

    # Hugging Face Inference API often requires knowing the MIME type or filename.
    # We can pass the raw bytes directly to requests if InferenceClient fails, 
    # but the easiest fix for InferenceClient is to use standard HTTP post.
    import requests
    
    headers = {"Authorization": f"Bearer {token}"}
    model_id = model or DEFAULT_HF_ASR_MODEL
    
    if DEFAULT_PROVIDER:
        # If using another provider route 
        try:
            client = InferenceClient(provider=DEFAULT_PROVIDER, api_key=token)
            audio_bytes = uploaded_file.read()
            output = client.automatic_speech_recognition(audio_bytes, model=model_id)
            if hasattr(output, "text") or (isinstance(output, dict) and "text" in output):
                return (getattr(output, "text", "") if hasattr(output, "text") else output.get("text", "")).strip()
        except Exception:
            pass # fallback below
            
    # Reset file pointer if read above
    uploaded_file.seek(0)
    
    # Fallback to direct HTTP request to default API
    API_URL = f"https://router.huggingface.co/hf-inference/models/{model_id}"
    if hasattr(uploaded_file, "type") and uploaded_file.type:
        headers["Content-Type"] = uploaded_file.type
    audio_bytes = uploaded_file.read()
    response = requests.post(API_URL, headers=headers, data=audio_bytes)
    
    if response.status_code != 200:
        raise RuntimeError(f"Hugging Face API Error {response.status_code}: {response.text}")
        
    output = response.json()

    # output can be a dict-like or an object; handle both.
    if hasattr(output, "text"):
        return (getattr(output, "text") or "").strip()
    if isinstance(output, dict) and "text" in output:
        return (output.get("text") or "").strip()

    return str(output).strip()
