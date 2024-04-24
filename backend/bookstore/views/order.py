from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from django.forms.models import model_to_dict
from ..serializers.order import OrderSerializer, BookOrderSerializer
from ..messages.order import OrderMessage
from ..models.order import Order, BookOrder
from ..models.consumer import Consumer
from ..models.book import Book
from ..models.storage import BookStorage
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
        consumer.Debt += totalValue

        if (totalValue >= paid_value):
            Order.RemainingValue = totalValue - paid_value
        else:
            return Response ({ OrderMessage.MSG1002 }, status = status.HTTP_400_BAD_REQUEST)

        maxDebt = Parameter.objects.filter(ParameterName='maxDebt').first()
        if consumer.Debt >= float(maxDebt.Value):
            return Response({OrderMessage.MSG1001}, status = status.HTTP_400_BAD_REQUEST)
        
        consumer.save()
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

    def post(self, request):
        bookOrder_data = BookOrderSerializer(data=request.data)
        if not bookOrder_data.is_valid(raise_exception = True):
            return Response (
                {
                    "success": False,
                    "message": OrderMessage.MSG0003
                }, status = status.HTTP_400_BAD_REQUEST
            )
        
        order_id = bookOrder_data.validated_data["OrderId"]
        book_id = bookOrder_data.validated_data["BookId"]
        quantity = bookOrder_data.validated_data["Quantity"]

        try:
            order = Order.objects.get(OrderId = order_id)
        except Order.DoesNotExist:
             return Response({ OrderMessage.MSG0004 }, status = status.HTTP_404_NOT_FOUND)
        try:
            book = Book.objects.get(BookId = book_id)
        except Book.DoesNotExist:
            return Response ({ OrderMessage.MSG0004 }, status = status.HTTP_404_NOT_FOUND)
        try:
            bookStorage = BookStorage.objects.get(BookId = book_id)
        except BookStorage.DoesNotExist:
            return Response ({ OrderMessage.MSG0004 }, status = status.HTTP_404_NOT_FOUND)
        
        minQuantity = Parameter.objects.filter(ParameterName='minQuantity').first()
        percentPrice = Parameter.objects.filter(ParameterName='percentPrice').first()
        book.Quantity -= quantity
        if quantity <= int(minQuantity.Value):
            return Response ({ OrderMessage.MSG1003 }, status = status.HTTP_400_BAD_REQUEST)
        
        order.TotalValue += bookStorage.UnitPrice * percentPrice * quantity
        order.save()
        book.save()
        BookOrder (
            OrderID = order,
            BookID = book,
            Quantity = quantity
        ).save()

class getAllBookOrderAPIView(GenericAPIView):
    serializer_class = BookOrderSerializer

    def get(self, request):
        try:
            orders = BookOrder.objects.all()
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
        except BookOrder.DoesNotExist:
            return Response(
                {"message": OrderMessage.MSG0004},
                status=status.HTTP_404_NOT_FOUND
            )

class getBookOrderAPIView(GenericAPIView):
    serializer_class = BookOrderSerializer

    def get(self, request, pk):
        try:
            order = BookOrder.objects.get(pk=pk)
            return Response({
                "success": True,
                "message": OrderMessage.MSG0001,
                "data": model_to_dict(order)
            }, status = status.HTTP_200_OK
            )
        except BookOrder.DoesNotExist:
            return Response(
                {"message": OrderMessage.MSG0004},
                status=status.HTTP_404_NOT_FOUND
            )