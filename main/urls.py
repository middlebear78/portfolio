from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("home/", views.home, name="home"),
    path("project/<int:id>", views.project, name="project"),
    path('contact/', views.send_contact_email, name='contact'),
]
