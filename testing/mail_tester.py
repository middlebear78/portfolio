import smtplib
from email.mime.text import MIMEText
import os 
from dotenv import load_dotenv
load_dotenv()

smtp_server = 'smtp.gmail.com'
smtp_port = 587
smtp_user = os.getenv('EMAIL_HOST_USER')     
smtp_password = os.getenv('EMAIL_HOST_PASSWORD')

msg = MIMEText('This is a test message.')
msg['From'] = smtp_user
msg['To'] = 'recipient@example.com' 
msg['Subject'] = 'Test Email from Gmail'

try:
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()  
    server.login(smtp_user, smtp_password)  
    server.sendmail(smtp_user, 'recipient@example.com',
                    msg.as_string())  
    print("Email sent successfully!")
except Exception as e:
    print(f"Error: {e}")
finally:
    server.quit()
