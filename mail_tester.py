import smtplib
from email.mime.text import MIMEText

smtp_server = 'smtp.gmail.com'
smtp_port = 587
smtp_user = 'urisham@gmail.com'  # Your Gmail address
smtp_password = "ynro tjes uals sxqc"  # App password

msg = MIMEText('This is a test message.')
msg['From'] = smtp_user
msg['To'] = 'recipient@example.com'  # The recipient email address
msg['Subject'] = 'Test Email from Gmail'

try:
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()  # Secure the connection
    server.login(smtp_user, smtp_password)  # Login with the App Password
    server.sendmail(smtp_user, 'recipient@example.com', msg.as_string())  # Send email
    print("Email sent successfully!")
except Exception as e:
    print(f"Error: {e}")
finally:
    server.quit()
