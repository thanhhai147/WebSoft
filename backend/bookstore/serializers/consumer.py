from rest_framework import serializers
from ..models.consumer import Consumer

class ConsumerSerializer(serializers.Serializer):
    Name = serializers.CharField()
    Address = serializers.CharField()
    Phone = serializers.CharField()
    Email = serializers.EmailField(allow_null = True, allow_blank = True)