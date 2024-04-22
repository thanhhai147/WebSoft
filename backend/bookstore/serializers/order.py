from rest_framework import serializers

class OrderSerializer(serializers.Serializer):
    ConsumerId = serializers.IntegerField()
    PaidValue = serializers.FloatField()


class BookOrderSerializer(serializers.Serializer):
    OrderId = serializers.IntegerField()
    BookId = serializers.IntegerField()
    Quantity = serializers.IntegerField()