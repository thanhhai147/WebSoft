from rest_framework import serializers
from django.core.validators import MinValueValidator

class BookTypeSerializer(serializers.Serializer):
    bookTypeName = serializers.CharField(max_length=255)

class AuthorSerializer(serializers.Serializer):
    authorName = serializers.CharField(max_length=255)

class BookSerializer(serializers.Serializer):
    bookName = serializers.CharField(max_length=255)
    bookTypeId = serializers.IntegerField()
    authorId = serializers.IntegerField()