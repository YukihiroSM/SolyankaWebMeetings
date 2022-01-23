from django import forms
from chat.models import Person


class RegistrationForm(forms.ModelForm):
    class Meta:
        model = Person
        fields = ['username', 'password']


class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)
