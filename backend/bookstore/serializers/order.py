from rest_framework import serializers

class OrderSerializer(serializers.Serializer):
    ConsumerId = serializers.IntegerField()
    Date = serializers.DateField()
    TotalValue = serializers.FloatField()
    PaidValue = serializers.FloatField()
    RemainingValue = serializers.FloatField()

class BookOrderSerializer(serializers.Serializer):
    OrderId = serializers.IntegerField()
    BookId = serializers.IntegerField()
    Quantity = serializers.IntegerField()
    UnitSoldPrice = serializers.FloatField()