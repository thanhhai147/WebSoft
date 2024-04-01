from rest_framework import serializers
from ..models.storage import Storage, BookStorage

class StorageSerializer(serializers.Serializer):
    date = serializers.DateField()
    created = serializers.DateTimeField()

class BookStorageSerializer(serializers.Serializer):
    storageId = serializers.IntegerField()
    bookId = serializers.IntegerField()
    quantity = serializers.IntegerField()
    unitPrice = serializers.IntegerField()
    created = serializers.DateTimeField()