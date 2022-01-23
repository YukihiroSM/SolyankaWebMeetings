from django.urls import path
from django.views.generic import RedirectView
from . import views


urlpatterns = [
    path('', RedirectView.as_view(url='login/')),
    path('lobby/', views.lobby, name='lobby'),
    path('room/<slug:room_name>/', views.room, name='room'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
]
