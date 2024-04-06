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
                "message": StorageMessage.MSG3001,
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
                    "message": StorageMessage.MSG3002
                }
            )  
        return Response({
                "success": True,
                "message": StorageMessage.MSG3001,
                "data": model_to_dict(queryset)
            }, status=status.HTTP_200_OK)
    
class AddBookToStorageViewAPI(GenericAPIView):
    serializer_class = BookStorageSerializer
    queryset = BookStorage.objects.all()

    def get(self, request):
        return Response({"success": True,})
    
    def post(self, request):
        bookStorageData = BookStorageSerializer(data=request.data)

        if not bookStorageData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": StorageMessage.MSG2007
            }, status=status.HTTP_400_BAD_REQUEST)
        
        storageId = bookStorageData.validated_data['storageId']
        bookId = bookStorageData.validated_data['bookId']
        unitPrice = bookStorageData.validated_data['unitPrice']
        quantity = bookStorageData.validated_data['quantity']

        minBook = Parameter.objects.filter(ParameterName='MinBook').first()
        maxBook = Parameter.objects.filter(ParameterName='MaxBook').first()
        if (quantity < minBook or quantity > maxBook):
            return Response(
                {
                    "success": False,
                    "message": StorageMessage.MSG2002
                }
            ) 
            
        try:
            storage = Storage.objects.get(pk=storageId)
        except Storage.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": StorageMessage.MSG2002
                }
            )     
           
        try:
            book = Book.objects.get(pk=bookId)
            book.Quantity = book.Quantity + quantity
            book.save()
        except Book.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": StorageMessage.MSG2003
                }
            )
        
        BookStorage(StorageId = storage, BookId = book, Quantity = quantity, UnitPrice = unitPrice).save()
        
        return Response({
                "success": True,
                "message": StorageMessage.MSG2006,
                "data": bookStorageData.data
            }, status=status.HTTP_200_OK)