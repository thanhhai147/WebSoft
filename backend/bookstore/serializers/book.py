from rest_framework import serializers
from django.core.validators import MinValueValidator

class BookTypeSerializer(serializers.Serializer):
    bookTypeName = serializers.CharField(max_length=255, required=True, allow_null=False)

class AuthorSerializer(serializers.Serializer):
    authorName = serializers.CharField(max_length=255, required=True, allow_null=False)

class BookSerializer(serializers.Serializer):
    bookName = serializers.CharField(max_length=255, required=True, allow_null=False)
    bookTypeId = serializers.IntegerField(required=True, allow_null=False)
    authorId = serializers.IntegerField(required=True, allow_null=False)