from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from .book import Book

class Storage(models.Model):
    StorageId = models.AutoField(primary_key=True)
    Date = models.DateField(default=timezone.now)
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return str(self.StorageId)

class BookStorage(models.Model):
    StorageId = models.ForeignKey(Storage, on_delete=models.CASCADE, null=False, blank=False)
    BookId = models.ForeignKey(Book, on_delete=models.CASCADE, null=False, blank=False)
    Quantity = models.IntegerField(null=False, blank=False, validators=[MinValueValidator(0)])
    UnitPrice = models.FloatField(null=False, blank=False, validators=[MinValueValidator(0)])
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return str(self.StorageId)