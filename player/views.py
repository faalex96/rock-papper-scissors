from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.


@login_required
def profile_view(request):
    return render(request, 'player/profile_page.html', {})


@login_required
def quick_match_view(request):
    return render(request, 'match/quick_match.html', {})


@login_required
def design_match(request):
    return render(request, 'match/design_match.html', {})
