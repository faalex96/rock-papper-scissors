from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Player
import json

# Create your views here.


@login_required
def profile_view(request):
    leader_board = Player.objects.all().order_by('-wins')
    return render(request, 'player/profile_page.html', {"leader_board": leader_board})


@login_required
def quick_match_view(request):
    return render(request, 'match/quick_match.html', {})


@login_required
def design_match(request):
    return render(request, 'match/design_match.html', {})


@login_required
def end_game(request):
    if request.method == "POST":
        post_data = json.loads(request.body.decode("utf-8"))
        player = request.user.player
        if post_data["win"] == 1:
            player.win()
        elif post_data["lose"] == 1:
            player.lost()
        player.calc_avg()
    return render(request, 'match/quick_match.html', {})
