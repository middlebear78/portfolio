import random
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from .forms import ContactForm
from .models import Project, Tag

def home(request):
    projects = Project.objects.all()
    tags = Tag.objects.all()

    # Fetch a random image for each project
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

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            # Get form data
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']

            # Create email content
            email_message = f"""
            New contact form submission:

            Name: {name}
            Email: {email}
            Subject: {subject}
            Message:
            {message}
            """

            try:
                # Send email
                send_mail(
                    subject=f'Contact Form: {subject}',
                    message=email_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.CONTACT_EMAIL],
                    fail_silently=False,
                )

                return JsonResponse({
                    'status': 'success',
                    'message': 'Your message has been sent. Thank you!'
                })
            except Exception as e:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Failed to send email. Please try again later.'
                }, status=500)
        else:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid form data. Please check your inputs.'
            }, status=400)

    else:
        form = ContactForm()

    return render(request, 'contact.html', {'form': form})
