from rest_framework import serializers
from django.core.validators import MinValueValidator

class BookTypeSerializer(serializers.Serializer):
    bookTypeName = serializers.CharField(max_length=255, required=True, allow_blank=False)

class AuthorSerializer(serializers.Serializer):
    authorName = serializers.CharField(max_length=255, required=True, allow_blank=False)

class BookSerializer(serializers.Serializer):
    bookName = serializers.CharField(max_length=255, required=True, allow_blank=False)
    bookTypeId = serializers.IntegerField(required=True, allow_blank=False)
    authorId = serializers.IntegerField(required=True, allow_blank=False)
    quantity = serializers.IntegerField(validators=[MinValueValidator(0)], required=True, allow_blank=False)