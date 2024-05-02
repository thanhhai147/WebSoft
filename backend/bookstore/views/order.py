from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from django.forms.models import model_to_dict
from ..serializers.order import OrderSerializer, BookOrderSerializer, OrderDetailSerializer
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
    serializer_class = OrderDetailSerializer

    def post(self, request):
        order_data = OrderDetailSerializer(data=request.data)
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
        
        order_instance = Order.objects.create(
            ConsumerId=consumer,
            PaidValue=paid_value,
            TotalValue=0,
            RemainingValue=0
        )
        minQuantity = Parameter.objects.filter(ParameterName='minQuantity').first()
        percentPrice = Parameter.objects.filter(ParameterName='percentPrice').first()

        book_orders = order_data.validated_data['BookOrder']
        for book_order in book_orders:
            book_id = book_order['BookId']
            quantity = book_order['Quantity']

            try:
                book = Book.objects.get(BookId = book_id)
            except Book.DoesNotExist:
                order_instance.delete() 
                return Response ({ OrderMessage.MSG0004 }, status = status.HTTP_404_NOT_FOUND)
            
            try:
                bookStorage = BookStorage.objects.get(BookId = book_id)
            except BookStorage.DoesNotExist:
                order_instance.delete() 
                return Response ({ OrderMessage.MSG0004 }, status = status.HTTP_404_NOT_FOUND)
            
            book.Quantity -= quantity
            if book.Quantity <= int(minQuantity.Value):
                order_instance.delete()
                return Response ({ OrderMessage.MSG1003 }, status = status.HTTP_400_BAD_REQUEST)
            total_value = 0 
            unitSoldPrice = bookStorage.UnitPrice * float(percentPrice.Value)
            total_value += unitSoldPrice * quantity

            BookOrder.objects.create(
                OrderId=order_instance,
                BookId=book,
                Quantity=quantity,
                UnitSoldPrice=unitSoldPrice
            )
                # Cập nhật tổng giá trị đơn hàng
        order_instance.TotalValue = total_value
        if (total_value >= paid_value):
            remainingValue = total_value - paid_value
            consumer.Debt += remainingValue
            consumer.save()
        else:
            order_instance.delete()
            return Response({OrderMessage.MSG1002}, status = status.HTTP_400_BAD_REQUEST)
        order_instance.RemainingValue = remainingValue

        maxDebt = Parameter.objects.filter(ParameterName='maxDebt').first()
        if consumer.Debt >= float(maxDebt.Value):
            order_instance.delete() 
            return Response({OrderMessage.MSG1001}, status = status.HTTP_400_BAD_REQUEST)

        order_instance.save()

        return Response({
                "success": True,
                "message": OrderMessage.MSG0001,
                "data": order_data.validated_data
        }, status = status.HTTP_200_OK)

        

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

