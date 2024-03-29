from rest_framework import serializers
from ..models.storage import Storage, BookStorage

class BookStorageSerializer(serializers.Serializer):
    date = serializers.DateField()
    created = serializers.DateTimeField()

class StorageSerializer(serializers.Serializer):
    bookId = serializers.IntegerField()
    quantity = serializers.IntegerField()
    unitPrice = serializers.IntegerField()
    created = serializers.DateTimeField()