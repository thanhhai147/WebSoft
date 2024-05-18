from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status

from django.core.serializers import serialize
from django.forms.models import model_to_dict
from ..serializers.book import BookTypeSerializer, AuthorSerializer, BookSerializer
from ..models import BookType, Author, Book, Parameter, BookStorage
from django.db.models import Q

from ..messages.book import BookMessage

class GetBookType(GenericAPIView):
    serializer_class = BookTypeSerializer
    queryset = BookType.objects.all()

    def get(self, request):
        queryset = BookType.objects.all()

        bookTypeData = []
        for bookType in queryset:
            bookTypeData.append({
                'id': bookType.BookTypeId,
                'name': bookType.BookTypeName,
                'created': bookType.Created
            })

        return Response({
                "success": True,
                "message": BookMessage.MSG1001,
                "data": bookTypeData
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
                    "message": BookMessage.MSG1002
                }
            )  
        return Response({
                "success": True,
                "message": BookMessage.MSG1001,
                "data": model_to_dict(queryset)
            }, status=status.HTTP_200_OK)
    
class GetAuthor(GenericAPIView):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()

    def get(self, request):
        queryset = Author.objects.all()

        authorData = []
        for author in queryset:
            authorData.append({
                'id': author.AuthorId,
                'name': author.AuthorName,
                'created': author.Created
            })

        return Response({
                "success": True,
                "message": BookMessage.MSG2001,
                "data": authorData
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
                    "message": BookMessage.MSG2002
                }
            )  
        return Response({
                "success": True,
                "message": BookMessage.MSG2001,
                "data": model_to_dict(queryset)
            }, status=status.HTTP_200_OK)

class GetBook(GenericAPIView):
    serializer_class = BookSerializer
    queryset = Book.objects.all()

    def get(self, request):
        queryset = Book.objects.all()

        bookData = []
        for book in queryset:
            price = BookStorage.objects.filter(BookId=book.BookId).order_by('Created').last()
            bookData.append({
                'id': book.BookId,
                'bookName': book.BookName,
                'authorName': book.AuthorId.AuthorName if book.AuthorId != None else None,
                'bookTypeName': book.BookTypeId.BookTypeName if book.BookTypeId != None else None,
                'quantity': book.Quantity,
                'price': price.UnitPrice if price is not None else None,
                'created': book.Created,
                'active': book.Active,
            })

        return Response({
                "success": True,
                "message": BookMessage.MSG3001,
                "data": bookData
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
                    "message": BookMessage.MSG3002
                }
            )
        price = BookStorage.objects.filter(BookId=queryset.BookId).order_by('Created').last()
        bookData = {
            'id': queryset.BookId,
            'bookName': queryset.BookName,
            'authorName': queryset.AuthorId.AuthorName if queryset.AuthorId != None else None,
            'bookTypeName': queryset.BookTypeId.BookTypeName if queryset.BookTypeId != None else None,
            'quantity': queryset.Quantity,
            'price': price.UnitPrice if price is not None else None,
            'created': queryset.Created,
            'active': queryset.Active,
        }
        
        return Response({
                "success": True,
                "message": BookMessage.MSG3001,
                "data": bookData
            }, status=status.HTTP_200_OK)

class AddBookTypeAPIVIew(GenericAPIView):
    serializer_class = BookTypeSerializer
    queryset = BookType.objects.all()

    def get(self, request):
        queryset = BookType.objects.all()

        bookTypeData = {}
        for bookType in queryset:
            bookTypeData[bookType.BookTypeId] = model_to_dict(bookType)

        return Response({
                "success": True,
                "message": BookMessage.MSG1001,
                "data": bookTypeData
            }, status=status.HTTP_200_OK)
    
    def post(self, request):
        bookTypeData = BookTypeSerializer(data=request.data)

        if not bookTypeData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": BookMessage.MSG1004
            }, status=status.HTTP_400_BAD_REQUEST)
        
        bookTypeName = bookTypeData.data['bookTypeName']
        
        if (bookTypeName is None):
            return Response({
                "success": False,
                "message": BookMessage.MSG1009
            }, status=status.HTTP_400_BAD_REQUEST)
        
        maxNameLength = Parameter.objects.filter(ParameterName='MaxNameLength').first()
        minBNameLength = Parameter.objects.filter(ParameterName='MinNameLength').first()

        if (len(bookTypeName) < minBNameLength.Value or
            len(bookTypeName) > maxNameLength.Value):
            return Response({
                "success": False,
                "message": BookMessage.MSG1010
            }, status=status.HTTP_400_BAD_REQUEST)

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
        queryset = Author.objects.all()

        authorData = {}
        for author in queryset:
            authorData[author.AuthorId] = model_to_dict(author)

        return Response({
                "success": True,
                "message": BookMessage.MSG2001,
                "data": authorData
            }, status=status.HTTP_200_OK)

    def post(self, request):
        authorData = AuthorSerializer(data=request.data)
        
        if not authorData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": BookMessage.MSG2004
            }, status=status.HTTP_400_BAD_REQUEST)
        
        authorName = authorData.data['authorName']

        if (authorName is None):
            return Response({
                "success": False,
                "message": BookMessage.MSG2009
            }, status=status.HTTP_400_BAD_REQUEST)
        
        maxNameLength = Parameter.objects.filter(ParameterName='MaxNameLength').first()
        minBNameLength = Parameter.objects.filter(ParameterName='MinNameLength').first()

        if (len(authorName) < minBNameLength.Value or
            len(authorName) > maxNameLength.Value):
            return Response({
                "success": False,
                "message": BookMessage.MSG2010
            }, status=status.HTTP_400_BAD_REQUEST)
        
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
        queryset = Book.objects.all()

        bookData = {}
        for book in queryset:
            bookData[book.BookId] = model_to_dict(book)

        return Response({
                "success": True,
                "message": BookMessage.MSG3001,
                "data": bookData
            }, status=status.HTTP_200_OK)
    
    
    def post(self, request):
        bookData = BookSerializer(data=request.data)
        
        if not bookData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": BookMessage.MSG3004
            }, status=status.HTTP_400_BAD_REQUEST)
        
        bookName = bookData.validated_data['bookName']
        bookTypeId = bookData.validated_data['bookTypeId']
        authorId = bookData.validated_data['authorId']
        active = bookData.validated_data['active']
        
        if (bookName is None):
            return Response({
                "success": False,
                "message": BookMessage.MSG3009
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            bookType = BookType.objects.get(pk=bookTypeId) if bookTypeId != None else None
            author = Author.objects.get(pk=authorId) if authorId != None else None
        except BookType.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG3011
                }
            )
        except Author.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG3012
                }
            )

        maxNameLength = Parameter.objects.filter(ParameterName='MaxNameLength').first()
        minNameLength = Parameter.objects.filter(ParameterName='MinNameLength').first()

        if (len(bookName) < minNameLength.Value or
            len(bookName) > maxNameLength.Value):
            return Response({
                "success": False,
                "message": BookMessage.MSG3010
            }, status=status.HTTP_400_BAD_REQUEST)
        
        Book(BookName = bookName, BookTypeId = bookType, AuthorId = author, Active = active).save()

        return Response({
                "success": True,
                "message": BookMessage.MSG3003,
                "data": bookData.data
            }, status=status.HTTP_200_OK)

class EditBookTypeViewAPI(GenericAPIView):
    serializer_class = AuthorSerializer
    queryset = BookType.objects.all()

    def get(self, request, id):
        try:
            queryset = BookType.objects.get(pk=id)
        except BookType.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG1002
                }
            )  
        return Response({
                "success": True,
                "message": BookMessage.MSG1001,
                "data": model_to_dict(queryset)
            }, status=status.HTTP_200_OK)

    def put(self, request, id):
        bookTypeData = BookTypeSerializer(data=request.data)

        try:
            queryset = BookType.objects.get(pk=id)
        except BookType.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG1002
                }
            )  
        
        if not bookTypeData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": BookMessage.MSG1006
            }, status=status.HTTP_400_BAD_REQUEST)
        
        bookTypeName = bookTypeData.data['bookTypeName']
        if (bookTypeName is None):
            return Response({
                "success": False,
                "message": BookMessage.MSG1009
            }, status=status.HTTP_400_BAD_REQUEST)
        
        maxNameLength = Parameter.objects.filter(ParameterName='MaxNameLength').first()
        minBNameLength = Parameter.objects.filter(ParameterName='MinNameLength').first()

        if (len(bookTypeName) < minBNameLength.Value or
            len(bookTypeName) > maxNameLength.Value):
            return Response({
                "success": False,
                "message": BookMessage.MSG1010
            }, status=status.HTTP_400_BAD_REQUEST)

        queryset.BookTypeName = bookTypeName
        queryset.save()
            
        return Response({
                "success": True,
                "message": BookMessage.MSG1005,
                "data": bookTypeData.data
            }, status=status.HTTP_200_OK)
       
class EditAuthorViewAPI(GenericAPIView):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()

    def get(self, request, id):
        try:
            queryset = Author.objects.get(pk=id)
        except Author.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG2002
                }
            )
        authorName = queryset.AuthorName
        return Response({
            "success": True,
            "message": BookMessage.MSG2001,
            "data": {
                "authorName": authorName,
            }
        }, status=status.HTTP_200_OK)

    def put(self, request, id):
        authorData = AuthorSerializer(data=request.data)
        try:
            queryset = Author.objects.get(pk=id)
        except Author.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG2002
                }
            )  
        
        if not authorData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": BookMessage.MSG2006
            }, status=status.HTTP_400_BAD_REQUEST)
        
        authorName = authorData.data['authorName']

        if (authorName is None):
            return Response({
                "success": False,
                "message": BookMessage.MSG2009
            }, status=status.HTTP_400_BAD_REQUEST)
        
        maxNameLength = Parameter.objects.filter(ParameterName='MaxNameLength').first()
        minBNameLength = Parameter.objects.filter(ParameterName='MinNameLength').first()

        if (len(authorName) < minBNameLength.Value or
            len(authorName) > maxNameLength.Value):
            return Response({
                "success": False,
                "message": BookMessage.MSG2010
            }, status=status.HTTP_400_BAD_REQUEST)
        
        queryset.save()
            
        return Response({
                "success": True,
                "message": BookMessage.MSG2005,
                "data": {
                    "authorName": authorName
                }
            }, status=status.HTTP_200_OK)
    
class EditBookViewAPI(GenericAPIView):
    serializer_class = BookSerializer
    queryset = Book.objects.all()

    def get(self, request, id):
        try:
            queryset = Book.objects.get(pk=id)
        except Book.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG3002
                }
            )  
        return Response({
                "success": True,
                "message": BookMessage.MSG3001,
                "data": model_to_dict(queryset)
            }, status=status.HTTP_200_OK)
    
    def put(self, request, id):
        bookData = BookSerializer(data=request.data)

        try:
            queryset = Book.objects.get(pk=id)
        except Book.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG3002
                }
            )  
        
        if not bookData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": BookMessage.MSG3006
            }, status=status.HTTP_400_BAD_REQUEST)
              
        bookName = bookData.validated_data['bookName']
        bookTypeId = bookData.validated_data['bookTypeId']
        authorId = bookData.validated_data['authorId']
        active = bookData.validated_data['active']

        if (bookName is None):
            return Response({
                "success": False,
                "message": BookMessage.MSG3009
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            bookType = BookType.objects.get(pk=bookTypeId) if bookTypeId != None else None
            author = Author.objects.get(pk=authorId) if authorId != None else None
        except BookType.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG3011
                }
            )
        except Author.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG3012
                }
            )

        maxNameLength = Parameter.objects.filter(ParameterName='MaxNameLength').first()
        minBNameLength = Parameter.objects.filter(ParameterName='MinNameLength').first()

        if (len(bookName) < minBNameLength.Value or
            len(bookName) > maxNameLength.Value):
            return Response({
                "success": False,
                "message": BookMessage.MSG3010
            }, status=status.HTTP_400_BAD_REQUEST)
            
        queryset.BookName = bookName
        queryset.BookTypeId = bookType
        queryset.AuthorId = author
        if (active != None): 
            queryset.Active = active
        
        queryset.save()

        return Response({
                "success": True,
                "message": BookMessage.MSG3005,
                "data": model_to_dict(queryset)
            }, status=status.HTTP_200_OK)

class DeleteBookTypeViewAPI(GenericAPIView):
    serializer_class = AuthorSerializer
    queryset = BookType.objects.all()

    def get(self, request, id):
        try:
            queryset = BookType.objects.get(pk=id)
        except BookType.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG1002
                }
            )  
        return Response({
                "success": True,
                "message": BookMessage.MSG1001,
                "data": model_to_dict(queryset)
            }, status=status.HTTP_200_OK)

    def delete(self, request, id):
        try:
            queryset = BookType.objects.get(pk=id)
        except BookType.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG1002
                }
            )  

        queryset.delete()
            
        return Response({
                "success": True,
                "message": BookMessage.MSG1007,
            }, status=status.HTTP_200_OK)
    
class DeleteAuthorViewAPI(GenericAPIView):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()

    def get(self, request, id):
        try:
            queryset = Author.objects.get(pk=id)
        except Author.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG2002
                }
            )  
        return Response({
                "success": True,
                "message": BookMessage.MSG2001,
                "data": model_to_dict(queryset)
            }, status=status.HTTP_200_OK)

    def delete(self, request, id):
        try:
            queryset = Author.objects.get(pk=id)
        except Author.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG2002
                }
            )  

        queryset.delete()
            
        return Response({
                "success": True,
                "message": BookMessage.MSG2007,
            }, status=status.HTTP_200_OK)
    
class DeleteBookViewAPI(GenericAPIView):
    serializer_class = AuthorSerializer
    queryset = Book.objects.all()

    def get(self, request, id):
        try:
            queryset = Book.objects.get(pk=id)
        except Book.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG3002
                }
            )  
        return Response({
                "success": True,
                "message": BookMessage.MSG3001,
                "data": model_to_dict(queryset)
            }, status=status.HTTP_200_OK)

    def delete(self, request, id):
        try:
            queryset = Book.objects.get(pk=id)
        except Book.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": BookMessage.MSG3002
                }
            )  

        queryset.Active = False
        queryset.save()
            
        return Response({
                "success": True,
                "message": BookMessage.MSG3007,
            }, status=status.HTTP_200_OK)
    