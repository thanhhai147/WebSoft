from rest_framework import serializers

class BookTypeSerializer(serializers.Serializer):
    bookTypeName = serializers.CharField(required=True, allow_null=False)

class AuthorSerializer(serializers.Serializer):
    authorName = serializers.CharField(required=True, allow_null=False)

class BookSerializer(serializers.Serializer):
    bookName = serializers.CharField(required=True, allow_null=False)
    bookTypeId = serializers.IntegerField(allow_null=True)
    authorId = serializers.IntegerField(allow_null=True)
    active = serializers.BooleanField(allow_null=True)