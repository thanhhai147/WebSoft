from django.urls import path

from ..views.storage import AddBookToStorageViewAPI, GetStorageViewAPI, GetStorageViewWithIdAPI, GetBookStorageViewWithIdAPI, GetBookStorageViewAPI, GetMonthReportViewAPI

urlpatterns = [
    path('', GetStorageViewAPI.as_view(), name='get-storage'),
    path('reports', GetMonthReportViewAPI.as_view(), name='get-book-storage-report'),
    path('<int:id>', GetStorageViewWithIdAPI.as_view(), name='get-storage-with-id'),
    path('book-storage', GetBookStorageViewAPI.as_view(), name='get-book-storage'),
    path('book-storage/new', AddBookToStorageViewAPI.as_view(), name='add-book-to-storage'),
    path('book-storage/<int:id>', GetBookStorageViewWithIdAPI.as_view(), name='get-book-storage-with-id'),
]