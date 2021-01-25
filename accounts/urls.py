from django.urls import path, include
from .views import home_view, sign_up_view, test_view, logout_view

urlpatterns = [
    path('home/', home_view, name="home"),
    path('accounts/sign-up/', sign_up_view, name="sign-up"),
    path('accounts/test/', test_view),
    path('accounts/logout/', logout_view),
]
