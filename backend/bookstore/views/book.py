
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status

from django.core.serializers import serialize
from django.forms.models import model_to_dict
from ..serializers.book import BookTypeSerializer, AuthorSerializer, BookSerializer
from ..models import BookType, Author, Book

from ..messages.book import BookMessage

class GetBookType(GenericAPIView):
    serializer_class = BookTypeSerializer
    queryset = BookType.objects.all()

    def get(self, request):
        queryset = BookType.objects.all()

        return Response({
                "success": True,
                "message": BookMessage.MSG4001,
                "data": serialize("json", queryset)
            }, status=status.HTTP_200_OK)
    
class GetBookTypeWithId(GenericAPIView):
    serializer_class = BookTypeSerializer
    queryset = BookType.objects.all()
    def get(self, request, id):
        try:
            queryset = BookType.objects.get(pk=id)
        except BookType.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG4002
                }
            )  
        return Response({
                "success": True,
                "message": BookMessage.MSG4001,
                "data": model_to_dict(queryset)
            }, status=status.HTTP_200_OK)
    
class GetAuthor(GenericAPIView):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()

    def get(self, request):
        queryset = Author.objects.all()

        return Response({
                "success": True,
                "message": BookMessage.MSG5001,
                "data": serialize("json", queryset)
            }, status=status.HTTP_200_OK)
class GetAuthorWithId(GenericAPIView):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()
    def get(self, request, id):
        try:
            queryset = Author.objects.get(pk=id)
        except Author.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG5002
                }
            )  
        return Response({
                "success": True,
                "message": BookMessage.MSG5001,
                "data": model_to_dict(queryset)
            }, status=status.HTTP_200_OK)

class GetBook(GenericAPIView):
    serializer_class = BookSerializer
    queryset = Book.objects.all()

    def get(self, request):
        queryset = Book.objects.all()

        return Response({
                "success": True,
                "message": BookMessage.MSG6001,
                "data": serialize("json", queryset)
            }, status=status.HTTP_200_OK)
class GetBookWithId(GenericAPIView):
    serializer_class = BookSerializer
    queryset = Book.objects.all()
    def get(self, request, id):
        try:
            queryset = Book.objects.get(pk=id)
        except Book.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG6002
                }
            )  
        return Response({
                "success": True,
                "message": BookMessage.MSG6001,
                "data": model_to_dict(queryset)
            }, status=status.HTTP_200_OK)
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
        
        BookType(BookTypeName = bookTypeName).save()

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

        Author(AuthorName = authorName).save()
            
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
                "message": BookMessage.MSG3007
            }, status=status.HTTP_400_BAD_REQUEST)
        
        bookName = bookData.validated_data['bookName']
        bookTypeId = bookData.validated_data['bookTypeId']
        authorId = bookData.validated_data['authorId']
        
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
        
        Book(BookName = bookName, BookTypeId = bookType, AuthorId = author).save()

        return Response({
                "success": True,
                "message": BookMessage.MSG3006,
                "data": bookData.data
            }, status=status.HTTP_200_OK)

class EditBookTypeViewAPI(GenericAPIView):
    serializer_class = AuthorSerializer
    queryset = BookType.objects.all()

    def get(self, request):
        return Response({"success": True,})

    def post(self, request, id):
        bookTypeData = BookTypeSerializer(data=request.data)
        try:
            queryset = BookType.objects.get(pk=id)
        except BookType.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG6002
                }
            )  
        
        if not bookTypeData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": BookMessage.MSG2004
            }, status=status.HTTP_400_BAD_REQUEST)
        
        bookTypeName = bookTypeData.data['bookTypeName']
        if (bookTypeName is not None):
            queryset.BookTypeName = bookTypeName
        queryset.save()
            
        return Response({
                "success": True,
                "message": BookMessage.MSG2003,
                "data": bookTypeData.data
            }, status=status.HTTP_200_OK)
       
class EditAuthorViewAPI(GenericAPIView):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()

    def get(self, request):
        return Response({"success": True,})

    def post(self, request, id):
        authorData = AuthorSerializer(data=request.data)
        try:
            queryset = Author.objects.get(pk=id)
        except Author.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG6002
                }
            )  
        
        if not authorData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": BookMessage.MSG2004
            }, status=status.HTTP_400_BAD_REQUEST)
        
        authorName = authorData.data['authorName']
        if (authorName is not None):
            queryset.AuthorName = authorName
        queryset.save()
            
        return Response({
                "success": True,
                "message": BookMessage.MSG2003,
                "data": authorData.data
            }, status=status.HTTP_200_OK)
    
class EditBookViewAPI(GenericAPIView):
    serializer_class = BookSerializer
    queryset = Book.objects.all()

    def get(self, request):
        return Response({"success": True,})
    
    def put(self, request, id):
        bookData = BookSerializer(data=request.data)
        try:
            queryset = Book.objects.get(pk=id)
        except Book.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG6002
                }
            )  
        
        if not bookData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": BookMessage.MSG3007
            }, status=status.HTTP_400_BAD_REQUEST)
        
        bookName = bookData.validated_data['bookName']
        bookTypeId = bookData.validated_data['bookTypeId']
        authorId = bookData.validated_data['authorId']
        
        queryset.BookName = bookName

        if bookTypeId is not None:
            try:
                bookType = BookType.objects.get(pk=bookTypeId)
            except BookType.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": BookMessage.MSG3003
                    }
                )
            queryset.BookTypeId = bookType
        
        if authorId is not None:
            try:
                author = Author.objects.get(pk=authorId)
            except Author.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": BookMessage.MSG3004
                    }
                )
            queryset.AuthorId = authorId
        
        queryset.save()

        return Response({
                "success": True,
                "message": BookMessage.MSG3006,
                "data": bookData.data
            }, status=status.HTTP_200_OK)

class DeleteBookTypeViewAPI(GenericAPIView):
    serializer_class = AuthorSerializer
    queryset = BookType.objects.all()

    def get(self, request):
        return Response({"success": True,})

    def delete(self, request, id):
        try:
            queryset = BookType.objects.get(pk=id)
        except BookType.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG6002
                }
            )  

        queryset.delete()
            
        return Response({
                "success": True,
                "message": BookMessage.MSG2003,
            }, status=status.HTTP_200_OK)
    
class DeleteAuthorViewAPI(GenericAPIView):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()

    def get(self, request):
        return Response({"success": True,})

    def delete(self, request, id):
        try:
            queryset = Author.objects.get(pk=id)
        except Author.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG6002
                }
            )  

        queryset.delete()
            
        return Response({
                "success": True,
                "message": BookMessage.MSG2003,
            }, status=status.HTTP_200_OK)
    
class DeleteBookViewAPI(GenericAPIView):
    serializer_class = AuthorSerializer
    queryset = Book.objects.all()

    def get(self, request):
        return Response({"success": True,})

    def delete(self, request, id):
        try:
            queryset = Book.objects.get(pk=id)
        except Book.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG6002
                }
            )  

        queryset.delete()
            
        return Response({
                "success": True,
                "message": BookMessage.MSG2003,
            }, status=status.HTTP_200_OK)
    