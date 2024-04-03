from django.urls import path

from ..views.consumer import CreateConsumerAPIView, GetConsumerDetailAPIView, UpdateConsumerAPIView, DeleteConsumerAPIView
    
urlpatterns = [
    path('consumer/create/', CreateConsumerAPIView.as_view(), name='create_consumer'),
    path('consumer/<int:pk>/', GetConsumerDetailAPIView.as_view(), name='get_consumer_detail'),
    path('consumer/<int:pk>/update/', UpdateConsumerAPIView.as_view(), name='update_consumer'),
    path('consumer/<int:pk>/delete/', DeleteConsumerAPIView.as_view(), name='delete_consumer')]