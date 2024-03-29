from rest_framework import serializers
from ..models.storage import Storage, BookStorage

class BookStorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookStorage
        fields = '__all__'

class StorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Storage
        fields = '__all__'