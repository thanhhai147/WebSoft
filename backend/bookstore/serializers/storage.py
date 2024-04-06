from rest_framework import serializers
from django.core.validators import MinValueValidator

class StorageSerializer(serializers.Serializer):
    date = serializers.DateField()

class BookStorageSerializer(serializers.Serializer):
    storageId = serializers.IntegerField(required=True, allow_blank=False)
    bookId = serializers.IntegerField(required=True, allow_blank=False)
    unitPrice = serializers.IntegerField(validators=[MinValueValidator(0)], required=True, allow_blank=False)
    quantity = serializers.IntegerField(validators=[MinValueValidator(0)], required=True, allow_blank=False)