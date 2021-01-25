from django.urls import path, include
from .views import profile_view, quick_match_view, design_match

urlpatterns = [
    path('accounts/player/profile_page/', profile_view, name='profile'),
    path('accounts/player/quick_match/', quick_match_view, name="quick-match"),
    path('accounts/player/desig_match/', design_match, name="design-match"),
]
