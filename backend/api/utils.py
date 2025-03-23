import smtplib
from email.mime.text import MIMEText
from django.conf import settings

def send_email_custom(subject, message, recipient_email):
    try:
        msg = MIMEText(message)
        msg["Subject"] = subject
        msg["From"] = settings.EMAIL_HOST_USER
        msg["To"] = recipient_email

        with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
            server.starttls()  # ✅ Use without extra arguments
            server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
            server.sendmail(settings.EMAIL_HOST_USER, recipient_email, msg.as_string())

        return True
    except Exception as e:
        print("Error sending email:", e)
        return False