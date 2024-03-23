from django.urls import path

from ..views.account import SignInViewAPIView, GetAccessFunctionAPIView, SignOutAPIView
    
urlpatterns = [
    path('account/sign-in/', SignInViewAPIView.as_view(), name='signin'),
    path('account/sign-out/', SignOutAPIView.as_view(), name='signout'),
    path('account/authorization/', GetAccessFunctionAPIView.as_view(), name='authorization')
]