import smtplib
from email.message import EmailMessage

class Notifier:
    def __init__(self, config):
        self.email = config.notification_email

    def send_email(self, to_addr: str, subject: str, body: str):
        if not self.email:
            return
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = self.email
        msg["To"] = to_addr
        msg.set_content(body)
        try:
            with smtplib.SMTP("localhost") as s:
                s.send_message(msg)
        except Exception as exc:
            print(f"Failed to send email: {exc}")
