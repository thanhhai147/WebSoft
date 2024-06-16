from django.contrib import admin
from .models import account, book, consumer, order, parameter, payment, storage
# from import_export.admin import ImportExportMixin

# Register your models here.
class AccountAdmin(admin.ModelAdmin):
    list_display = ('AccountId', 'AccountName', 'Role', 'Password', 'Created')
    list_filter = ['Created', 'Role']
    search_fields = ['AccountName', 'AccountId', 'Role']

class TokenAdmin(admin.ModelAdmin):
    list_display = ('Key', 'AccountId', 'Created')
    list_filter = ['Created']
    search_fields = ['Key', 'AccountId']

class BookTypeAdmin(admin.ModelAdmin):
    list_display = ('BookTypeId', 'BookTypeName', 'Created')
    list_filter = ['BookTypeId', 'BookTypeName', 'Created']
    search_fields = ['BookTypeId', 'BookTypeName']
    
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('AuthorId', 'AuthorName', 'Created')
    list_filter = ['Created']
    search_fields = ['AuthorId', 'AuthorName']

class BookAdmin(admin.ModelAdmin):
    list_display = ('BookId', 'BookName', 'BookTypeId', 'AuthorId', 'Quantity', 'Active', 'Created')
    list_filter = ['BookTypeId', 'Active', 'Created']
    search_fields = ['BookId', 'BookName', 'BookTypeId', 'AuthorId']
    
class ConsumerAdmin(admin.ModelAdmin):
    list_display = ('ConsumerId', 'Name', 'Address', 'Phone', 'Email', 'Debt', 'Created')
    list_filter = ['Created']
    search_fields = ['ConsumerId', 'Name', 'Address', 'Phone', 'Email']
    
class OrderAdmin(admin.ModelAdmin):
    list_display = ('OrderId', 'ConsumerId', 'Date', 'TotalValue', 'PaidValue', 'RemainingValue', 'Created')
    list_filter = ['Date', 'Created']
    search_fields = ['OrderId', 'ConsumerId']

class BookOrderAdmin(admin.ModelAdmin):
    list_display = ('OrderId', 'BookId', 'Quantity', 'UnitSoldPrice', 'Created')
    list_filter = ['Created']
    search_fields = ['OrderId', 'BookId']

class ParameterAdmin(admin.ModelAdmin):
    list_display = ('ParameterName', 'Value', 'Active', 'Created')
    list_filter = ['Active', 'Created']
    search_fields = ['ParameterName']

class PaymentAdmin(admin.ModelAdmin):
    list_display = ('PaymentId', 'ConsumerId', 'Date', 'Value', 'Created')
    list_filter = ['Date', 'Created']
    search_fields = ['PaymentId', 'ConsumerId']

class StorageAdmin(admin.ModelAdmin):
    list_display = ('StorageId', 'Date', 'Created')
    list_filter = ['Date', 'Created']
    search_fields = ['StorageId']

class BookStorageAdmin(admin.ModelAdmin):
    list_display = ('StorageId', 'BookId', 'Quantity', 'UnitPrice', 'Created')
    list_filter = ['Created']
    search_fields = ['StorageId', 'BookId']

admin.site.register(account.Account, AccountAdmin)
admin.site.register(account.Token, TokenAdmin)
admin.site.register(book.BookType, BookTypeAdmin)
admin.site.register(book.Author, AuthorAdmin)
admin.site.register(book.Book, BookAdmin)
admin.site.register(consumer.Consumer, ConsumerAdmin)
admin.site.register(order.Order, OrderAdmin)
admin.site.register(order.BookOrder, BookOrderAdmin)
admin.site.register(parameter.Parameter, ParameterAdmin)
admin.site.register(payment.Payment, PaymentAdmin)
admin.site.register(storage.Storage, StorageAdmin)
admin.site.register(storage.BookStorage, BookStorageAdmin)
