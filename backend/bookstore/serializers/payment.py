from rest_framework import serializers
from ..models.payment import Payment

class PaymentSerializers (serializers.Serializer):
    ConsumerId = serializers.IntegerField()
    Value = serializers.FloatField()
