from django.urls import path

from ..views.account import LogInAPIView, GetAccessFunctionAPIView, LogOutAPIView
    
urlpatterns = [
    path('account/log-in/', LogInAPIView.as_view(), name='login'),
    path('account/log-out/', LogOutAPIView.as_view(), name='logout'),
    path('account/authorization/', GetAccessFunctionAPIView.as_view(), name='authorization')
]