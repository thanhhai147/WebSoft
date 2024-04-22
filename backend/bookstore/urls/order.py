from django.urls import path
from ..views.order import createOrderAPIView, getAllOrderAPIView, getOrderAPIView, createBookOrderAPIView, getAllBookOrderAPIView, getBookOrderAPIView


urlpatterns = [
    path('order/create/', createOrderAPIView.as_view(), name='create_order'),
    path('order/', getAllOrderAPIView.as_view(), name='get_all_order'),
    path('order/<int:pk>/', getOrderAPIView.as_view(), name='get_order'),
    path('order/book/create/', createBookOrderAPIView.as_view(), name='create_book_order'),
    path('order/book/', getAllBookOrderAPIView.as_view(), name='get_all_book_order'),
    path('order/book/<int:pk>/', getBookOrderAPIView.as_view(), name='get_book_order')
]