import random

from django.shortcuts import render, get_object_or_404

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


def contact(request):
    return render(request, "contact.html")


def project(request, id):
    project = get_object_or_404(Project, pk=id)
    images = project.images.all()
    random_image = images.order_by("?").first() if images.exists() else None

    # images = list(project.images.all())
    # random_image = random.choice(images) if images else None

    context = {
        'project': project,
        'random_image': random_image,
        "images": images
    }

    return render(request, "project.html", context)
