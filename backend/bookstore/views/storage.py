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
    
        date = dateData.validated_data['date']

        year = date.year
        month = date.month
        prev_day = 31
        if month == 1:
            prev_month = 12
            prev_year = year-1
        else:
            prev_month = month - 1
            prev_year = year

        prev_date = datetime(prev_year, prev_month, prev_day).date()
        now_date = datetime(year, month, calendar.monthrange(year, month)[1]).date()
        queryset_prev = BookStorage.objects.filter(
            Q(Created__date__lt=prev_date)
        )
        queryset_now = BookStorage.objects.filter(
            Q(Created__date__gt=prev_date) & Q(Created__date__lt=now_date)
        )
        # queryset = BookStorage.objects.all()
        bookStoragePrevData = {}
        for iter, bookStorage in enumerate(queryset_prev):
            bookStoragePrevData[f"{iter+1}"] = model_to_dict(bookStorage)

        # Tinh so luong ton dau
        bookPrevInventory = {}
        for iter, bookStorage in enumerate(queryset_prev):
            bookStorageDict = model_to_dict(bookStorage)
            bookId = bookStorageDict['BookId']
            quantity = bookStorageDict['Quantity']
            try:
                book = Book.objects.get(pk=bookId)
            except Book.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": StorageMessage.MSG2003 + str(bookId)
                    }
                )
            if bookId in bookPrevInventory:
                bookPrevInventory[bookId]["Quantity"] += quantity
            else:
                bookPrevInventory[bookId] = {
                    'BookName': book.BookName,
                    'Quantity': quantity
                }

        # Tinhs phat sinh
        bookStorageNowData = {}
        for iter, bookStorage in enumerate(queryset_now):
            bookStorageNowData[f"{iter+1}"] = model_to_dict(bookStorage)

        bookNowInventory = {}
        for iter, bookStorage in enumerate(queryset_now):
            bookStorageDict = model_to_dict(bookStorage)
            bookId = bookStorageDict['BookId']
            quantity = bookStorageDict['Quantity']
            try:
                book = Book.objects.get(pk=bookId)
            except Book.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": StorageMessage.MSG2003 + str(bookId)
                    }
                )
            if bookId in bookNowInventory:
                bookNowInventory[bookId]["Quantity"] += quantity
            else:
                bookNowInventory[bookId] = {
                    'BookName': book.BookName,
                    'Quantity': quantity
                }

        bookInventory = copy.deepcopy(bookNowInventory)
        for iter, bookStorage in enumerate(queryset_prev):
            bookStorageDict = model_to_dict(bookStorage)
            bookId = bookStorageDict['BookId']
            quantity = bookStorageDict['Quantity']
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
                    'Quantity': quantity
                }

        return Response({
                "success": True,
                "message": now_date,
                "data": bookPrevInventory
            }, status=status.HTTP_200_OK)