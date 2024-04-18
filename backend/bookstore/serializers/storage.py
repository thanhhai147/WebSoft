from rest_framework import serializers

class StorageSerializer(serializers.Serializer):
    date = serializers.DateField()

class BookStorageSerializer(serializers.Serializer):
    bookStorageId = serializers.IntegerField(required=True, allow_null=False)
    bookId = serializers.IntegerField(required=True, allow_null=False)
    unitPrice = serializers.IntegerField(required=True, allow_null=False)
    quantity = serializers.IntegerField(required=True, allow_null=False)