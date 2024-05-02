from rest_framework import serializers

class OrderSerializer(serializers.Serializer):
    ConsumerId = serializers.IntegerField()
    PaidValue = serializers.FloatField()

class BookOrderSerializer(serializers.Serializer):
    BookId = serializers.IntegerField()
    Quantity = serializers.IntegerField()

class OrderDetailSerializer(serializers.Serializer):
    ConsumerId = serializers.IntegerField()
    PaidValue = serializers.FloatField()
    BookOrder = BookOrderSerializer(many=True)