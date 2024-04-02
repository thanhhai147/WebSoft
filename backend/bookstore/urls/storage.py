from django.urls import path

from ..views.storage import AddBookToStorageViewAPI

urlpatterns = [
    path('book/new', AddBookToStorageViewAPI.as_view(), name='add-book-to-storage'),
]