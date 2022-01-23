from .models import Person, Link
from django.contrib.auth import login, authenticate
import uuid


def register(request, form) -> None:
    user = Person.objects.create(
        username=form.cleaned_data['username'],
        password=form.cleaned_data['password']
    )

    login(request, user)


def login_user(request, form) -> bool:
    try:
        user = Person.objects.get(
            username=form['username'].value(),
            password=form['password'].value()
        )
    except Person.DoesNotExist:
        return False
    else:
        login(request, user)
        return True


def connect_meet_link(request) -> str:
    random_link = uuid.uuid4().hex
    request.user.link = Link.objects.create(title=random_link)

    request.user.save()

    return random_link


def does_link_exist(room_name) -> bool:
    return Link.objects.filter(title=room_name).exists()
