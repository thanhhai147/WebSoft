from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status

from ..serializers.storage import BookStorageSerializer
from ..models import Storage, BookStorage, Book

from ..messages.storage import StorageMessage

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
            quantity = book.Quantity
        except Book.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": StorageMessage.MSG2003
                }
            )

        if quantity < 0:
            return Response(
                {
                    "success": False,
                    "message": StorageMessage.MSG2004
                }
            )
        if unitPrice < 0:
            return Response(
                {
                    "success": False,
                    "message": StorageMessage.MSG2005
                }
            )
        
        BookStorage(StorageId = storage, BookId = book, Quantity = quantity, UnitPrice = unitPrice).save()
        
        return Response({
                "success": True,
                "message": StorageMessage.MSG2006,
                "data": bookStorageData.data
            }, status=status.HTTP_200_OK)