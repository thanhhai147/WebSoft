from django.urls import path

from ..views.book import AddBookTypeAPIVIew, AddAuthorViewAPI, AddBookViewAPI, \
                         GetAuthor, GetAuthorWithId, GetBookType, GetBookTypeWithId, GetBook, GetBookWithId
    
urlpatterns = [
    path('book-type/new', AddBookTypeAPIVIew.as_view(), name='new-booktype'),
    path('author/new', AddAuthorViewAPI.as_view(), name='new-author'),
    path('book/new', AddBookViewAPI.as_view(), name='new-book'),
    path('book-type', GetBookType.as_view(), name='get-book-type'),
    path('book-type/<int:id>', GetBookTypeWithId.as_view(), name='get-book-type-with-id'),
    path('author', GetAuthor.as_view(), name='get-author'),
    path('author/<int:id>', GetAuthorWithId.as_view(), name='get-author-with-id'),
    path('book', GetBook.as_view(), name='get-book'),
    path('book/<int:id>', GetBookWithId.as_view(), name='get-book-with-id')
]