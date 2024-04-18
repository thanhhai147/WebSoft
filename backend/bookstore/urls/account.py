from django.urls import path

from ..views.account import LoginAPIView, GetAccessFunctionAPIView, LogoutAPIView
    
urlpatterns = [
    path('account/log-in/', LoginAPIView.as_view(), name='login'),
    path('account/log-out/', LogoutAPIView.as_view(), name='logout'),
    path('account/authorization/', GetAccessFunctionAPIView.as_view(), name='authorization')
]