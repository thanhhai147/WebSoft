from rest_framework import serializers
from ..models.payment import Payment

class paymentSerializers (serializers.Serializer):
    ConsumerID = serializers.IntegerField()
    Date = serializers.DateField()
    Value = serializers.FloatField()
    Created = serializers.DateTimeField()
