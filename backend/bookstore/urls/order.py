from django.urls import path
from ..views.order import createOrderAPIView, getOrderAPIView, getAllOrderAPIView, getOrderDetailAPIView

urlpatterns = [
    path('order/create', createOrderAPIView.as_view(), name='create_order'),
    path('order/<int:pk>', getOrderAPIView.as_view(), name='get_order'),
    path('order', getAllOrderAPIView.as_view(), name='get_all_order'),
]