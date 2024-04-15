from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from ..models.payment import Payment
from ..models.consumer import Consumer
from ..models.parameter import  Parameter
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
        
        consumer_id = payment_data.data['ConsumerId']
        date = payment_data.data['Date']
        value = payment_data.data['Value']
        
        try:
            consumer = Consumer.objects.get(pk=consumer_id)
        except Consumer.DoesNotExist:
            return Response({PaymentMessage.MSG1002}, status=status.HTTP_404_NOT_FOUND)
        
        if value <= 0:
                return Response({PaymentMessage.MSG1003}, status=status.HTTP_400_BAD_REQUEST)
        if value > consumer.Debt:
                return Response({PaymentMessage.MSG1004}, status=status.HTTP_400_BAD_REQUEST)
       
        consumer.Debt -= value
        consumer.save()

        Payment(
            ConsumerId = consumer_id,
            Date = date,
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
            payment = Payment.objects.all()
            payment_data = PaymentSerializers(payment, many=True)
            return Response(payment_data.data)
        except Payment.DoesNotExist:
            return Response({PaymentMessage.MSG1001}, status=status.HTTP_404_NOT_FOUND)
        
class GetPaymentDetailAPIView(GenericAPIView):
    serializer_class = PaymentSerializers
    def get(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
            payment_data = PaymentSerializers(payment)
            return Response(payment_data.data)
        except Payment.DoesNotExist:
            return Response({PaymentMessage.MSG1001}, status=status.HTTP_404_NOT_FOUND)


class DeletePaymentAPIView(GenericAPIView):
    serializer_class = PaymentSerializers 
    def delete(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
            payment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Payment.DoesNotExist:
            return Response({PaymentMessage.MSG1001}, status=status.HTTP_404_NOT_FOUND)