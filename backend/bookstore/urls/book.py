from django.urls import path

from ..views.book import AddBookTypeAPIVIew, AddAuthorViewAPI, AddBookViewAPI
    
urlpatterns = [
    path('book-type/new', AddBookTypeAPIVIew.as_view(), name='new-booktype'),
    path('author/new', AddAuthorViewAPI.as_view(), name='new-author'),
    path('book/new', AddBookViewAPI.as_view(), name='new-book')
]