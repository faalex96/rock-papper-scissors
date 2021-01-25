from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout
from django.contrib.auth.forms import UserCreationForm
from player.models import Player
# Create your views here.


def home_view(request):
    return render(request, 'accounts/home.html', {})


@login_required
def test_view(request):
    return render(request, 'accounts/test.html')


def sign_up_view(request):
    context = {}
    form = UserCreationForm(request.POST or None)
    if request.method == "POST":
        if form.is_valid():
            user = form.save()
            Player.objects.create(player=user)
            login(request, user)
            return render(request, 'accounts/test.html', {})
    context['form'] = form
    return render(request, 'registration/signup.html', context)


def logout_view(request):
    if request.method == "POST":
        logout(request)
        return redirect('/accounts/login/')
