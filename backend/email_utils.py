import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Try to load .env from the root directory (one level up from backend)
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path, override=True)

# You can also fall back to the backend directory if needed, 
# although load_dotenv handles the logic nicely if specified carefully.
# load_dotenv()

def send_otp_email(receiver_email: str, otp_code: str):
    """
    Sends an OTP code to the provided email address using SMTP credentials from .env.
    """
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")

    if not all([smtp_server, smtp_port, smtp_username, smtp_password]):
        print(f"--- [WARNING] SMTP credentials missing in .env. Faking OTP send to {receiver_email}: {otp_code} ---")
        return True # Simulate success for testing environments without credentials

    sender_email = smtp_username

    message = MIMEMultipart("alternative")
    message["Subject"] = "Your AI Study Buddy OTP Code"
    message["From"] = f"AI Study Buddy <{sender_email}>"
    message["To"] = receiver_email

    # HTML Email body
    html = f"""
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
    
    html_part = MIMEText(html, "html")
    message.attach(html_part)

    try:
        port = int(smtp_port)
        # Create a secure SSL context
        # Use SMTP_SSL for port 465, or STARTTLS for port 587
        if port == 465:
            server = smtplib.SMTP_SSL(smtp_server, port)
        else:
            server = smtplib.SMTP(smtp_server, port)
            server.starttls()
            
        server.login(smtp_username, smtp_password)
        server.sendmail(sender_email, receiver_email, message.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email to {receiver_email}: {e}")
        return False
