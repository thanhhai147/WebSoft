from rest_framework import serializers

class StorageSerializer(serializers.Serializer):
    date = serializers.DateField()

class BookStorageSerializer(serializers.Serializer):
    bookId = serializers.IntegerField(required=True, allow_null=False)
    unitPrice = serializers.IntegerField(required=True, allow_null=False)
    quantity = serializers.IntegerField(required=True, allow_null=False)

class DateTimeSerializer(serializers.Serializer):
    date = serializers.DateField()
