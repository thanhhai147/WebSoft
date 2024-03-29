from rest_framework import serializers
from ..models.book import BookType, Author, Book

class BookTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookType
        fields = '__all__'

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'