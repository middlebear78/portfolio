import os
import google.auth
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# The scopes required for sending emails via Gmail
SCOPES = ['https://www.googleapis.com/auth/gmail.send']


def authenticate_gmail():
    """Authenticate the user and generate an OAuth2 token for Gmail"""
    creds = None
    # Check if we have already saved credentials
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)

    # If there are no valid credentials available, let the user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)

        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    return creds


def send_email_via_gmail(subject, body, to_email):
    """Send email using the Gmail API with OAuth2 credentials"""
    creds = authenticate_gmail()

    # Build the email message
    message = MIMEMultipart()
    message['to'] = to_email
    message['subject'] = subject
    msg = MIMEText(body)
    message.attach(msg)
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

    # Send the email via Gmail API using the Gmail service
    try:
        service = build('gmail', 'v1', credentials=creds)
        send_message = service.users().messages().send(
            userId="me", body={'raw': raw_message}).execute()
        print(f'Message Id: {send_message["id"]}')
    except Exception as error:
        print(f'An error occurred while sending the email: {error}')


# Example usage
if __name__ == "__main__":
    # You can change the subject, body, and recipient email here
    try:
        send_email_via_gmail(
            'Test Email', 'This is a test email sent via Gmail using OAuth2', 'recipient@example.com')
    except Exception as e:
        print(f"Error during email send: {e}")
