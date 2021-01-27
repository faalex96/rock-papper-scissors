from django.urls import path, include
from .views import profile_view, quick_match_view, design_match, end_game, custom_match

urlpatterns = [
    path('accounts/player/profile_page/', profile_view, name='profile'),
    path('accounts/player/quick_match/', quick_match_view, name="quick-match"),
    path('accounts/player/design_match/', design_match, name="design-match"),
    path('accounts/player/end_match/', end_game, name="end-match"),
    path('accounts/player/custom_match/', custom_match, name="custom-match"),
]
