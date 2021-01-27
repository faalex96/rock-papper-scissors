from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Player, CustomMatch
import json

# Create your views here.


@login_required
def profile_view(request):
    leader_board = Player.objects.all().order_by('-wins')
    return render(request, 'player/profile_page.html', {"leader_board": leader_board})


@login_required
def quick_match_view(request):
    if request.method == "GET":
        if request.is_ajax():
            data = {
                "round-number": 5,
                "discard-option": ""
            }
            return JsonResponse(data)
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


@login_required
def custom_match(request):
    context = {}
    if request.method == "POST":
        context["round-num"] = request.POST.get('round-num')
        context["discard-option"] = request.POST.get(
            'choice') if request.POST.get('choice') is not None else ""

        match = CustomMatch.objects.create(
            round_number=context['round-num'], discard_option=context['discard-option'])
        match.save()
    elif request.method == "GET":
        if request.is_ajax():
            match = CustomMatch.objects.all().last()
            data = {}
            data["round-number"] = match.round_number
            data["discard-option"] = match.discard_option
            #data = json.dumps(CustomMatch.objects.all().last().__dict__)
            return JsonResponse(data)
    return render(request, 'match/custom_match.html', {})
