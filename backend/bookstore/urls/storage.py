from django.urls import path

from ..views.storage import AddBookToStorageViewAPI, GetBookStorageViewWithIdAPI, GetBookStorageViewAPI, GetMonthReportViewAPI

urlpatterns = [
    path('', GetBookStorageViewAPI.as_view(), name='get-book-storage'),
    path('reports', GetMonthReportViewAPI.as_view(), name='get-book-storage-report'),
    path('<int:id>', GetBookStorageViewWithIdAPI.as_view(), name='get-book-storage-with-id'),
    path('book/new', AddBookToStorageViewAPI.as_view(), name='add-book-to-storage'),
]