from django.urls import path

from ..views.book import AddBookTypeAPIVIew, AddAuthorViewAPI, AddBookViewAPI, \
                         GetBookTypeWithId, GetAuthor, GetAuthorWithId, GetBookType, GetBook, GetBookWithId, \
                         EditBookTypeViewAPI, EditAuthorViewAPI, EditBookViewAPI
    
urlpatterns = [
    path('book-type/new', AddBookTypeAPIVIew.as_view(), name='new-booktype'),
    path('author/new', AddAuthorViewAPI.as_view(), name='new-author'),
    path('book/new', AddBookViewAPI.as_view(), name='new-book'),
    path('book-type', GetBookType.as_view(), name='get-book-type'),
    path('book-type/<int:id>', GetBookTypeWithId.as_view(), name='get-book-type-with-id'),
    path('book-type/<int:id>/edit', EditBookTypeViewAPI.as_view(), name='edit-book-type-with-id'),
    path('author', GetAuthor.as_view(), name='get-author'),
    path('author/<int:id>', GetAuthorWithId.as_view(), name='get-author-with-id'),
    path('author/<int:id>/edit', EditAuthorViewAPI.as_view(), name='edit-author-with-id'),
    path('book', GetBook.as_view(), name='get-book'),
    path('book/<int:id>', GetBookWithId.as_view(), name='get-book-with-id'),
    path('book/<int:id>/edit', EditBookViewAPI.as_view(), name='edit-book-with-id')
]