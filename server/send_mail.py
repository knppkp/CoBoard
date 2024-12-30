import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(sender_email, sender_password, receiver_email, subject, message):
    # Set up the MIME
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject

    # Add the message body
    msg.attach(MIMEText(message, 'plain'))

    # Create SMTP session
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(sender_email, sender_password)

    # Send the message
    server.sendmail(sender_email, receiver_email, msg.as_string())
    server.quit()

if __name__ == "__main__":
    if len(sys.argv) < 6:
        print("Usage: python send_mail.py <sender_email> <sender_password> <receiver_email> <subject> <message>")
        sys.exit(1)

    sender_email = sys.argv[1]
    sender_password = sys.argv[2]
    receiver_email = sys.argv[3]
    subject = sys.argv[4]
    message = sys.argv[5]

    send_email(sender_email, sender_password, receiver_email, subject, message)
