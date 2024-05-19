from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status
from django.forms.models import model_to_dict
from ..serializers.storage import BookStorageSerializer, DateTimeSerializer
from ..models import Storage, BookStorage, Book, Parameter, BookOrder, Author, BookType
from django.db.models import Q
import copy

from ..messages.storage import StorageMessage
from ..messages.book import BookMessage
    
class GetBookStorageViewAPI(GenericAPIView):
    serializer_class = BookStorageSerializer
    queryset = BookStorage.objects.all()
    def get(self, request):
        queryset = BookStorage.objects.all()

        bookStorageData = []
        for _, bookStorage in enumerate(queryset):
            try:
                author = Author.objects.get(pk=bookStorage.BookId.AuthorId.AuthorId) if bookStorage.BookId.AuthorId != None else None
            except Author.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": BookMessage.MSG2002
                    }
                )
            try:
                bookType = BookType.objects.get(pk=bookStorage.BookId.BookTypeId.BookTypeId) if bookStorage.BookId.BookTypeId != None else None
            except BookType.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": BookMessage.MSG1002
                    }
                )
            unitPrice = bookStorage.UnitPrice
            quantity = bookStorage.Quantity
            bookStorageData.append({
                'StorageId': bookStorage.StorageId.StorageId,
                'BookId': bookStorage.BookId.BookId,
                'BookName': bookStorage.BookId.BookName,
                'BookTypeId': bookType.BookTypeId if bookType != None else None,
                'BookTypeName': bookType.BookTypeName if bookType != None else None,
                'AuthorId': author.AuthorId if author != None else None,
                'AuthorName': author.AuthorName if author != None else None,
                'Created': bookStorage.Created,
                'unitPrice': unitPrice,
                'quantity': quantity
            })
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
        
        storagesData = []

        for _, storageData in enumerate(queryset):
            storages = BookStorage.objects.filter(StorageId=storageData)
            
            thisStorageData = []
            for _, storage in enumerate(storages):
                try:
                    author = Author.objects.get(pk=storage.BookId.AuthorId.AuthorId) if storage.BookId.AuthorId != None else None
                except Author.DoesNotExist:
                    return Response(
                        {
                            "success": False,
                            "message": BookMessage.MSG2002
                        }
                    )
                try:
                    bookType = BookType.objects.get(pk=storage.BookId.BookTypeId.BookTypeId) if storage.BookId.BookTypeId != None else None
                except BookType.DoesNotExist:
                    return Response(
                        {
                            "success": False,
                            "message": BookMessage.MSG1002
                        }
                    )
                bookId = storage.BookId.BookId
                unitPrice = storage.UnitPrice
                quantity = storage.Quantity
                thisStorageData.append({
                    'BookId': bookId,
                    'BookName': storage.BookId.BookName,
                    'BookTypeId': bookType.BookTypeId if bookType != None else None,
                    'BookTypeName': bookType.BookTypeName if bookType != None else None,
                    'AuthorId': author.AuthorId if author != None else None,
                    'AuthorName': author.AuthorName if author != None else None,
                    'Created': storage.Created,
                    'unitPrice': unitPrice,
                    'quantity': quantity,
                })
                
            storagesData.append({
                "storageId": storage.StorageId.StorageId,
                "storageData":thisStorageData,
            })
        
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
            try:
                author = Author.objects.get(pk=storage.BookId.AuthorId.AuthorId) if storage.BookId.AuthorId != None else None
            except Author.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": BookMessage.MSG2002
                    }
                )
            try:
                bookType = BookType.objects.get(pk=storage.BookId.BookTypeId.BookTypeId) if storage.BookId.BookTypeId != None else None
            except BookType.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": BookMessage.MSG1002
                    }
                )
            bookId = storage.BookId.BookId
            unitPrice = storage.UnitPrice
            quantity = storage.Quantity
            storageData.append({
                'BookId': bookId,
                'BookName': storage.BookId.BookName,
                'BookTypeId': bookType.BookTypeId if bookType != None else None,
                'BookTypeName': bookType.BookTypeName if bookType != None else None,
                'AuthorId': author.AuthorId if author != None else None,
                'AuthorName': author.AuthorName if author != None else None,
                'Created': storage.Created,
                'unitPrice': unitPrice,
                'quantity': quantity,
            })
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

        queryset_start = BookStorage.objects.filter(
            Q(Created__date__lte=startDate)
        )
        queryset_end = BookStorage.objects.filter(
            Q(Created__date__gt=startDate) & Q(Created__date__lte=endDate)
        )
        queryset_order = BookOrder.objects.filter(
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

        # Book order from the start to the end date
        bookOrderData = {}
        for iter, bookOrder in enumerate(queryset_order):
            bookOrderData[f"{iter+1}"] = model_to_dict(bookOrder)
        
        bookOrderNow = {}
        for iter, bookOrder in enumerate(queryset_order):
            bookOrderDict = model_to_dict(bookOrder)
            bookId = bookOrderDict['BookId']
            quantity = bookOrderDict['Quantity']
            created = bookOrderDict['Created']
            try:
                book = Book.objects.get(pk=bookId)
            except Book.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": StorageMessage.MSG2003 + str(bookId)
                    }
                )
            if bookId in bookOrderNow:
                bookOrderNow[bookId]["Quantity"] -= quantity
            else:
                bookOrderNow[bookId] = {
                    'BookName': book.BookName,
                    'Quantity': -quantity,
                    'Created': created
                }

        # Subtract the number of books sold in bookOrderNow from bookInventory
        for bookId, orderData in bookOrderNow.items():
            if bookId in bookInventory:
                bookInventory[bookId]["Quantity"] += orderData["Quantity"]
            else:
                return Response(
                    {
                        "success": False,
                        "message": StorageMessage.MSG2003 + str(bookId)
                    }
                )

        data = {
            "Start": startDate,
            "End": endDate,
            "A": bookInventoryStart,
            "B": bookInventoryNow,
            "C": bookOrderNow,
            "A+B+C": bookInventory,
        }
        return Response({
                "success": True,
                "message": StorageMessage.MSG0001,
                "data": data
            }, status=status.HTTP_200_OK)