from rest_framework import serializers
from ..models.consumer import Consumer

class ConsumerSerializer(serializers.Serializer):
    Name = serializers.CharField(max_length = 255)
    Address = serializers.CharField(max_length = 255)
    Phone = serializers.CharField(max_length = 11)
    Email = serializers.EmailField(max_length = 320, allow_null = True, allow_blank = True)