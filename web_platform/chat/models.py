from django.contrib.auth.models import AbstractUser
from django.db import models


class Link(models.Model):
    """Link to meeting"""
    title = models.URLField('URL to meet', null=True)

    def __str__(self):
        return self.title


class Person(AbstractUser):
    """Usual user of the app"""
    link = models.ForeignKey(
        Link, on_delete=models.DO_NOTHING,
        verbose_name='link that was created by this user',
        null=True
    )

    def __str__(self):
        return self.username
