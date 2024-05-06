from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status
from django.core.serializers import serialize
from django.forms.models import model_to_dict
from ..serializers.storage import BookStorageSerializer, DateTimeSerializer
from ..models import Storage, BookStorage, Book, Parameter
from django.db.models import Q
from datetime import datetime
import copy
import calendar

from ..messages.storage import StorageMessage
    
class GetBookStorageViewAPI(GenericAPIView):
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

class GetStorageViewAPI(GenericAPIView):
    serializer_class = BookStorageSerializer
    queryset = BookStorage.objects.all()
    def get(self, request):
        queryset = Storage.objects.all()
        
        storagesData = {}

        for iter, storageData in enumerate(queryset):
            storages = BookStorage.objects.filter(StorageId=storageData)
            if(iter == 0):
                print(storages)
            thisStorageData = []
            for _, storage in enumerate(storages):
                thisStorageData.append(model_to_dict(storage))
            storagesData[f"{iter+1}"] = thisStorageData
        return Response({
                "success": True,
                "message": StorageMessage.MSG1001,
                "data": storagesData
            }, status=status.HTTP_200_OK)   
    
class GetStorageViewWithIdAPI(GenericAPIView):
    serializer_class = BookStorageSerializer
    queryset = BookStorage.objects.all()
    def get(self, request, id):
        try:
            queryset = Storage.objects.get(pk=id)
        except Storage.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": StorageMessage.MSG1005
                }
            )
        
        # storageData = {}
        storages = BookStorage.objects.filter(StorageId=queryset)
        storageData = []
        for iter, storage in enumerate(storages):
            storageData.append(model_to_dict(storage))
        return Response({
                "success": True,
                "message": StorageMessage.MSG1001,
                "data": storageData
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
        storage.save()
        for bookStorage in bookStorages:
            bookId = bookStorage['bookId']
            unitPrice = bookStorage['unitPrice']
            quantity = bookStorage['quantity']
            book = Book.objects.get(pk=bookId)
            book.Quantity = book.Quantity + quantity
            book.save()
            BookStorage(StorageId = storage, BookId = book, Quantity = quantity, UnitPrice = unitPrice).save()
        
        return Response({
                "success": True,
                "message": StorageMessage.MSG2007,
                "data": bookStorages
            }, status=status.HTTP_200_OK)

class GetMonthReportViewAPI(GenericAPIView):
    serializer_class = DateTimeSerializer
    queryset = BookStorage.objects.all()
    def get(self, request):
        queryset = BookStorage.objects.filter()

        bookStorageData = {}
        for iter, bookStorage in enumerate(queryset):
            bookStorageData[f"{iter+1}"] = model_to_dict(bookStorage)

        return Response({
                "success": True,
                "message": StorageMessage.MSG1001,
                "data": bookStorageData
            }, status=status.HTTP_200_OK)

    def post(self, request):
        dateData = DateTimeSerializer(data=request.data)
        if not dateData.is_valid(raise_exception=True):
            return Response({
                "success": False,
                "message": StorageMessage.MSG0003
            }, status=status.HTTP_400_BAD_REQUEST)
    
        startDate = dateData.validated_data['startDate']
        endDate = dateData.validated_data['endDate']

        # startDate = datetime(startDate).date()
        # endDate = datetime(endDate).date()

        queryset_start = BookStorage.objects.filter(
            Q(Created__date__lte=startDate)
        )
        queryset_end = BookStorage.objects.filter(
            Q(Created__date__gt=startDate) & Q(Created__date__lte=endDate)
        )
        
        # All Book Storage Record from begin to the start date
        bookStorageStartData = {}
        for iter, bookStorage in enumerate(queryset_start):
            bookStorageStartData[f"{iter+1}"] = model_to_dict(bookStorage)

        # The book inventory from begin to the start date
        bookInventoryStart = {}
        for iter, bookStorage in enumerate(queryset_start):
            bookStorageDict = model_to_dict(bookStorage)
            bookId = bookStorageDict['BookId']
            quantity = bookStorageDict['Quantity']
            created = bookStorageDict['Created']
            try:
                book = Book.objects.get(pk=bookId)
            except Book.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": StorageMessage.MSG2003 + str(bookId)
                    }
                )
            if bookId in bookInventoryStart:
                bookInventoryStart[bookId]["Quantity"] += quantity
            else:
                bookInventoryStart[bookId] = {
                    'BookName': book.BookName,
                    'Quantity': quantity,
                    'Created': created
                }

        # The book storage from the start to the end date
        bookStorageEndData = {}
        for iter, bookStorage in enumerate(queryset_end):
            bookStorageEndData[f"{iter+1}"] = model_to_dict(bookStorage)

        # The book inventory from start to the end date
        bookInventoryNow = {}
        for iter, bookStorage in enumerate(queryset_end):
            bookStorageDict = model_to_dict(bookStorage)
            bookId = bookStorageDict['BookId']
            quantity = bookStorageDict['Quantity']
            created = bookStorageDict['Created']
            try:
                book = Book.objects.get(pk=bookId)
            except Book.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": StorageMessage.MSG2003 + str(bookId)
                    }
                )
            if bookId in bookInventoryNow:
                bookInventoryNow[bookId]["Quantity"] += quantity
            else:
                bookInventoryNow[bookId] = {
                    'BookName': book.BookName,
                    'Quantity': quantity,
                    'Created': created
                }

        # The book storage difference between the begin-start and start-end book storage
        bookInventory = copy.deepcopy(bookInventoryNow)
        for iter, bookStorage in enumerate(queryset_start):
            bookStorageDict = model_to_dict(bookStorage)
            bookId = bookStorageDict['BookId']
            quantity = bookStorageDict['Quantity']
            created = bookStorageDict['Created']

            try:
                book = Book.objects.get(pk=bookId)
            except Book.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": StorageMessage.MSG2003 + str(bookId)
                    }
                )
            if bookId in bookInventory:
                bookInventory[bookId]["Quantity"] += quantity
            else:
                bookInventory[bookId] = {
                    'BookName': book.BookName,
                    'Quantity': quantity,
                    'Created': created,
                }
        
        data = {
            "Start": startDate,
            "End": endDate,
            "A": bookInventoryStart,
            "B": bookInventoryNow,
            "A+B": bookInventory,
        }
        return Response({
                "success": True,
                "message": StorageMessage.MSG0001,
                "data": data
            }, status=status.HTTP_200_OK)