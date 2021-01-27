from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
# Create your models here.


class Player(models.Model):
    player = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    wins = models.IntegerField(default=0)
    loses = models.IntegerField(default=0)
    avg_win = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    match_num = models.IntegerField(default=0)

    def calc_avg(self):
        self.avg_win = round((self.wins/self.match_num)*100, 2)
        self.save()

    def win(self):
        self.wins += 1
        self.match_num += 1
        self.save()

    def lost(self):
        self.loses += 1
        self.match_num += 1
        self.save()


class CustomMatch(models.Model):
    round_number = models.IntegerField(default=5)
    discard_option = models.CharField(max_length=10)
