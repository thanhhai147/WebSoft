from django.urls import path

from ..views.settings import GetSettingViewAPI, GetSettingWithNameViewAPI, EditSettingViewAPI, DeleteSettingViewAPI

urlpatterns = [
    path('settings', GetSettingViewAPI.as_view(), name='get-setting'),
    path('settings/<str:parameter_name>/', GetSettingWithNameViewAPI.as_view(), name='get-setting-with-name'),
    path('settings/<str:parameter_name>/edit', EditSettingViewAPI.as_view(), name='edit-setting-with-name'),
    path('settings/<str:parameter_name>/delete', DeleteSettingViewAPI.as_view(), name='delete-setting-with-name'),
]