from django.urls import path
from ..views.payment import CreatePaymentAPIView, GetPaymentDetailAPIView, DeletePaymentAPIView

urlpatterns = [
    path('payment/create/', CreatePaymentAPIView.as_view(), name='create_payment'),
    path('payment/<int:pk>/', GetPaymentDetailAPIView.as_view(), name='get_payment_detail'),
    path('payment/<int:pk>/delete/', DeletePaymentAPIView.as_view(), name='delete_payment'),
]