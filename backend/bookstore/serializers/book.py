from rest_framework import serializers

class BookTypeSerializer(serializers.Serializer):
    bookTypeName = serializers.CharField(required=True, allow_null=False)

class AuthorSerializer(serializers.Serializer):
    authorName = serializers.CharField(required=True, allow_null=False)

class BookSerializer(serializers.Serializer):
    bookName = serializers.CharField(required=True, allow_null=False)
    bookTypeId = serializers.IntegerField(required=True, allow_null=False)
    authorId = serializers.IntegerField(required=True, allow_null=False)