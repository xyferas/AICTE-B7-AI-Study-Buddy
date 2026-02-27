import os
import requests
from dotenv import load_dotenv

# Try to load .env from the root directory (one level up from backend)
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path, override=True)

def send_otp_email(receiver_email: str, otp_code: str):
    """
    Sends an OTP code via the Resend API using standard HTTP (Port 443),
    bypassing Render's strict outbound SMTP blocks.
    """
    api_key = os.getenv("RESEND_API_KEY")

    if not api_key:
        print(f"--- [WARNING] RESEND_API_KEY missing. Faking OTP send to {receiver_email}: {otp_code} ---")
        return True # Simulate success for local testing without an API key

    # Resend requires you to send from `onboarding@resend.dev` to your registered email address
    # if you haven't verified a custom domain yet.
    sender_email = "onboarding@resend.dev"

    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 30px;">
        <div style="max-w: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333333; text-align: center;">Welcome to AI Study Buddy!</h2>
          <p style="color: #555555; font-size: 16px; text-align: center;">
            Please use the following precise One-Time Password to sign in to your workspace.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <span style="font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 5px; color: #4F46E5; background-color: #EEF2FF; padding: 15px 25px; border-radius: 8px;">
              {otp_code}
            </span>
          </div>
          <p style="color: #777777; font-size: 14px; text-align: center;">
            This code will expire in 5 minutes. If you didn't request this, please ignore this email.
          </p>
        </div>
      </body>
    </html>
    """
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "from": f"AI Study Buddy <{sender_email}>",
        "to": [receiver_email],
        "subject": "Your AI Study Buddy OTP Code",
        "html": html_content
    }

    try:
        response = requests.post("https://api.resend.com/emails", json=payload, headers=headers)
        response.raise_for_status() # raises an exception for 4xx/5xx responses
        return True
    except requests.exceptions.RequestException as e:
        print(f"Failed to send email via Resend to {receiver_email}: {e}")
        if e.response is not None:
            print(f"Resend API Error Details: {e.response.text}")
        return False
