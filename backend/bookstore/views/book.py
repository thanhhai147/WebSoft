
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status

from ..serializers.book import BookTypeSerializer, AuthorSerializer, BookSerializer
from ..models import BookType, Author, Book

from ..messages.book import BookMessage

class AddBookTypeAPIVIew(GenericAPIView):
    serializer_class = BookTypeSerializer
    queryset = BookType.objects.all()

    def get(self, request):
        return Response({"success": True,})
    
    def post(self, request):
        bookTypeData = BookTypeSerializer(data=request.data)

        if not bookTypeData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": BookMessage.MSG1004
            }, status=status.HTTP_400_BAD_REQUEST)
        
        bookTypeName = bookTypeData.data['bookTypeName']
        created = bookTypeData.data['created']
        
        if len(bookTypeName) == 0 or bookTypeName is None:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG1001
                }
            )
        if len(bookTypeName) >= 255:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG1002
                }
            )
        
        BookType(BookTypeName = bookTypeName, Created = created).save()

        return Response({
                "success": True,
                "message": BookMessage.MSG1003,
                "data": bookTypeData.data,
            }, status=status.HTTP_200_OK)


class AddAuthorViewAPI(GenericAPIView):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()

    def get(self, request):
        return Response({"success": True,})

    def post(self, request):
        authorData = AuthorSerializer(data=request.data)
        
        if not authorData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": BookMessage.MSG2004
            }, status=status.HTTP_400_BAD_REQUEST)
        
        authorName = authorData.data['authorName']
        created = authorData.data['created']

        if len(authorName) == 0 or authorName is None:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG2001
                }
            )
        if len(authorName) >= 255:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG2002
                }
            )

        Author(AuthorName = authorName, Created = created).save()
            
        return Response({
                "success": True,
                "message": BookMessage.MSG2003,
                "data": authorData.data
            }, status=status.HTTP_200_OK)
    
class AddBookViewAPI(GenericAPIView):
    serializer_class = BookSerializer
    queryset = Book.objects.all()

    def get(self, request):
        return Response({"success": True,})
    
    def post(self, request):
        bookData = BookSerializer(data=request.data)

        if not bookData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": BookMessage.MSG3006
            }, status=status.HTTP_400_BAD_REQUEST)
        
        bookName = bookData.validated_data['bookName']
        bookTypeId = bookData.validated_data['bookTypeId']
        authorId = bookData.validated_data['authorId']
        quantity = bookData.validated_data['quantity']
        created = bookData.data['created']

        if len(bookName) == 0 or bookName is None:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG2001
                }
            )
        if len(bookName) >= 255:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG3002
                }
            )
        
        try:
            bookType = BookType.objects.get(pk=bookTypeId)
        except BookType.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG3003
                }
            )
        
        try:
            author = Author.objects.get(pk=authorId)
        except Author.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG3004
                }
            )
        if quantity < 0:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG3005
                }
            )
        
        Book(BookName = bookName, BookTypeId = bookType, AuthorId = author, Quantity = quantity, Created = created).save()

        return Response({
                "success": True,
                "message": BookMessage.MSG3006,
                "data": bookData.data
            }, status=status.HTTP_200_OK)