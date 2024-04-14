from rest_framework import serializers
from ..models.payment import Payment

class PaymentSerializers (serializers.Serializer):
    ConsumerId = serializers.Field()
    Date = serializers.DateField()
    Value = serializers.FloatField()
