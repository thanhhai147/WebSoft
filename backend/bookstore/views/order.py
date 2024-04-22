from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from django.forms.models import model_to_dict
from ..serializers.order import OrderSerializer, BookOrderSerializer
from ..messages.order import OrderMessage
from ..models.order import Order, BookOrder
from ..models.consumer import Consumer
from ..models.book import Book, BookType, Author
from ..models.parameter import Parameter

#----------------
#     Order
#----------------
class createOrderAPIView(GenericAPIView):
    serializer_class = OrderSerializer

    def post(self, request):
        order_data = OrderSerializer(data=request.data)
        if not order_data.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": OrderMessage.MSG0003
            }, status = status.HTTP_400_BAD_REQUEST)

        consumer_id = order_data.validated_data['ConsumerId']
        paid_value = order_data.validated_data['PaidValue']

        try:
            consumer = Consumer.objects.get(ConsumerId=consumer_id)
        except Consumer.DoesNotExist:
            return Response({ OrderMessage.MSG0004 }, status = status.HTTP_404_NOT_FOUND)
        
        totalValue = Order.TotalValue
        remainingValue = Order.RemainingValue

        if (totalValue > paid_value):
            remainingValue = totalValue - paid_value
            consumer.Debt += remainingValue
            consumer.save()
        else:
            remainingValue = paid_value - totalValue

        maxDebt = Parameter.objects.filter(ParameterName='maxDebt').first()
        if consumer.Debt >= maxDebt:
            return Response({OrderMessage.MSG1001}, status = status.HTTP_400_BAD_REQUEST)
        
        Order (
            ConsumerID = consumer,
            PaidValue = paid_value
        ).save()

class getAllOrderAPIView (GenericAPIView):
    serializer_class = OrderSerializer

    def get(self, request):
        try:
            orders = Order.objects.all()
            orders_data = {}
            for order in orders:
                orders_data[order.OrderId] = model_to_dict(order)
            return Response(
            {
                "success": True,
                "message": OrderMessage.MSG0001,
                "data": orders_data
            },
            status=status.HTTP_200_OK
        )
        except Order.DoesNotExist:
            return Response(
                {"message": OrderMessage.MSG0004},
                status=status.HTTP_404_NOT_FOUND
            )
    
class getOrderAPIView(GenericAPIView):
    serializer_class = OrderSerializer

    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)

            return Response(
            {
                "success": True,
                "message": OrderMessage.MSG0001,
                "data": model_to_dict(order)
            },
            status=status.HTTP_200_OK
        )
        except Order.DoesNotExist:
            return Response(
                {"message": OrderMessage.MSG0004},
                status=status.HTTP_404_NOT_FOUND
            )


#------------------
#    Book Order
#------------------
class createBookOrderAPIView(GenericAPIView):
    serializer_class = BookOrderSerializer
    queryset = BookOrder.objects.all()

    def post(self, request):
        serializer = BookOrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class getAllBookOrderAPIView(GenericAPIView):
    serializer_class = BookOrderSerializer
    queryset = BookOrder.objects.all()

    def get(self, request):
        orders = BookOrder.objects.all()
        serializer = BookOrderSerializer(orders, many=True)
        return Response(serializer.data)

class getBookOrderAPIView(GenericAPIView):
    serializer_class = BookOrderSerializer
    queryset = BookOrder.objects.all()

    def get(self, request, pk):
        order = BookOrder.objects.get(pk=pk)
        serializer = BookOrderSerializer(order)
        return Response(serializer.data)