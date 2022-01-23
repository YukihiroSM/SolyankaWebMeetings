from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .forms import RegistrationForm, LoginForm
from . import services


@login_required(login_url='login')
def lobby(request):
    """
    Render lobby where users can create room
    or set settings
    """
    if request.method == 'GET':
        return render(request, 'chat/lobby.html')

    elif request.method == 'POST':
        room_name = services.connect_meet_link(request)
        return redirect('room', room_name=room_name)
    return redirect('room')


@login_required(login_url='login')
def room(request, room_name):
    """Render room meeting"""
    if services.does_link_exist(room_name):
        return render(request, 'chat/room.html', {
            'room_name': room_name,
            'username': request.user.username
        })
    else:
        return redirect('lobby')


def register(request):
    """Register users"""
    if request.user.is_authenticated:
        return redirect('lobby')

    form = RegistrationForm()

    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            services.register(request, form)

            return redirect('lobby')

    return render(request, 'chat/reg_or_log.html/', {'form': form, 'type': 'register'})


def login(request):
    """Login users"""
    if request.user.is_authenticated:
        return redirect('lobby')

    form = LoginForm()

    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            is_logged = services.login_user(request, form)

            if is_logged:
                return redirect('lobby')

    return render(request, 'chat/reg_or_log.html/', {'form': form, 'type': 'login'})
