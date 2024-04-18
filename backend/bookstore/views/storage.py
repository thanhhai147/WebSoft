from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status
from django.core.serializers import serialize
from django.forms.models import model_to_dict
from ..serializers.storage import BookStorageSerializer
from ..models import Storage, BookStorage, Book, Parameter

from ..messages.storage import StorageMessage
    
class GetBookStorageViewAPI(GenericAPIView):
    serializer_class = BookStorageSerializer
    queryset = BookStorage.objects.all()
    def get(self, request):
        queryset = BookStorage.objects.all()

        return Response({
                "success": True,
                "message": StorageMessage.MSG1001,
                "data": serialize("json", queryset)
            }, status=status.HTTP_200_OK)

class GetBookStorageViewWithIdAPI(GenericAPIView):
    serializer_class = BookStorageSerializer
    queryset = BookStorage.objects.all()
    def get(self, request, id):
        try:
            queryset = BookStorage.objects.get(pk=id)
        except BookStorage.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": StorageMessage.MSG1002
                }
            )  
        return Response({
                "success": True,
                "message": StorageMessage.MSG1001,
                "data": model_to_dict(queryset)
            }, status=status.HTTP_200_OK)
    
class AddBookToStorageViewAPI(GenericAPIView):
    serializer_class = BookStorageSerializer
    queryset = BookStorage.objects.all()

    def get(self, request):
        queryset = BookStorage.objects.all()

        bookStorageData = {}
        for iter, bookStorage in enumerate(queryset):
            bookStorageData[f"{iter+1}"] = model_to_dict(bookStorage)

        return Response({
                "success": True,
                "message": StorageMessage.MSG1001,
                "data": bookStorageData
            }, status=status.HTTP_200_OK)
    
    def post(self, request):
        bookStorageData = BookStorageSerializer(data=request.data, many=True)

        if not bookStorageData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": StorageMessage.MSG2008
            }, status=status.HTTP_400_BAD_REQUEST)
        
        bookStorages = []
        print(bookStorageData.validated_data)
        for bookStorage in bookStorageData.validated_data:
            bookId = bookStorage['bookId']
            unitPrice = bookStorage['unitPrice']
            quantity = bookStorage['quantity']
            try:
                book = Book.objects.get(pk=bookId)
            except Book.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": StorageMessage.MSG2003 + str(bookId)
                    }
                )
            minBook = Parameter.objects.filter(ParameterName='MinBook').first()
            maxBook = Parameter.objects.filter(ParameterName='MaxBook').first()
            
            if quantity < int(minBook.Value):
                return Response(
                    {
                        "success": False,
                        "message": StorageMessage.MSG2004
                    }
                )
            if book.Quantity >= int(maxBook.Value):
                return Response(
                    {
                        "success": False,
                        "message": StorageMessage.MSG2005
                    }
                )   
            bookStorages.append(bookStorage)

        
        storage = Storage()
        for bookStorage in bookStorages:
            bookId = bookStorage['bookId']
            unitPrice = bookStorage['unitPrice']
            quantity = bookStorage['quantity']
            book.Quantity = book.Quantity + quantity
            book.save()
            BookStorage(StorageId = storage, BookId = book, Quantity = quantity, UnitPrice = unitPrice).save()
        
        return Response({
                "success": True,
                "message": StorageMessage.MSG2007,
                "data": bookStorages
            }, status=status.HTTP_200_OK)