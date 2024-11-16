import random
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from .forms import ContactForm
from .models import Project, Tag
from django.core.mail import send_mail
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from django.contrib import messages


def home(request):
    projects = Project.objects.all()
    tags = Tag.objects.all()

    for project in projects:
        images = list(project.images.all())
        project.random_image = random.choice(images) if images else None
        project.first_image = images[0] if images else None

    context = {
        'projects': projects,
        'tags': tags,
    }

    return render(request, 'home.html', context)


def project(request, id):
    project = get_object_or_404(Project, pk=id)
    images = project.images.all()
    random_image = images.order_by("?").first() if images.exists() else None

    context = {
        'project': project,
        'random_image': random_image,
        "images": images
    }

    return render(request, "project.html", context)


def send_contact_email(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')

        # Construct the email content
        subject = f"New Contact Form Submission: {subject}"
        message_content = f"Name: {name}\nEmail: {email}\nMessage: {message}"

        try:
            # Send the email
            send_mail(
                subject,
                message_content,
                # Sender email address (urisham@gmail.com)
                settings.DEFAULT_FROM_EMAIL,
                # Recipient email address (urisham@gmail.com)
                [settings.CONTACT_EMAIL],
                fail_silently=False  # Raise error if sending fails
            )
            messages.success(request, 'Your message has been sent. Thank you!')
            return JsonResponse({'success': True, 'message': 'Your message has been sent. Thank you!'})
        except Exception as e:
            messages.error(request, f'Error sending message: {str(e)}')
            return JsonResponse({'success': False, 'message': str(e)})
    messages.error(request, 'Invalid request')
    return JsonResponse({'success': False, 'message': 'Invalid request'})
