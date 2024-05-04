from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from django.forms.models import model_to_dict
from ..models.payment import Payment
from ..models.consumer import Consumer
from ..serializers.payment import PaymentSerializers
from ..messages.payment import PaymentMessage

class CreatePaymentAPIView(GenericAPIView):
    serializer_class = PaymentSerializers
    def post(self, request):
        payment_data = PaymentSerializers(data=request.data)

        if not payment_data.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": PaymentMessage.MSG0003
            }, status=status.HTTP_400_BAD_REQUEST)
        
        consumer_id = payment_data.validated_data['ConsumerId']
        value = payment_data.validated_data['Value']
        
        try:
            consumer = Consumer.objects.get(pk=consumer_id)
        except Consumer.DoesNotExist:
            return Response(
                            {
                                "success": False,
                                "message": PaymentMessage.MSG1002
                            }, status=status.HTTP_404_NOT_FOUND)
        
        if value <= 0:
            return Response(
                            {
                                "success": False,
                                "message": PaymentMessage.MSG1003
                            }, status=status.HTTP_400_BAD_REQUEST)
        
        if value > consumer.Debt:
                return Response(
                            {
                                "success": False,
                                "message": PaymentMessage.MSG1004
                            }, status=status.HTTP_400_BAD_REQUEST)
        
        consumer.Debt -= value
        consumer.save()

        Payment(
            ConsumerId = consumer,
            Value = value
            ).save()

        return Response(
            {
                "success": True,
                "message": PaymentMessage.MSG0001,
                "data": payment_data.data
            },
            status=status.HTTP_200_OK
        )

class GetAllPaymentDetailAPIView(GenericAPIView):
    serializer_class = PaymentSerializers
    def get(self, request):
        try:
            payments = Payment.objects.all()
            payment_data = {}
            for payment in payments:
                payment_data[payment.PaymentId] = model_to_dict(payment)

            return Response(
            {
                "success": True,
                "message": PaymentMessage.MSG0001,
                "data": payment_data
            },
            status=status.HTTP_200_OK    
            )
        except Payment.DoesNotExist:
            return Response(
                            {
                                "success": False,
                                "message": PaymentMessage.MSG1001
                            }, status=status.HTTP_404_NOT_FOUND)
        
class GetPaymentDetailAPIView(GenericAPIView):
    serializer_class = PaymentSerializers
    def get(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
            return Response(
            {
                "success": True,
                "message": PaymentMessage.MSG0001,
                "data": model_to_dict(payment)
            },
            status=status.HTTP_200_OK
            )
        except Payment.DoesNotExist:
            return Response(
                            {
                                "success": False,
                                "message": PaymentMessage.MSG1001
                            }, status=status.HTTP_404_NOT_FOUND)

