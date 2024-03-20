from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from .consumer import Consumer
from .book import Book

class Order(models.Model):
    OrderId = models.AutoField(primary_key=True)
    ConsumerId = models.ForeignKey(Consumer, on_delete=models.CASCADE, null=False, blank=False)
    Date = models.DateField(default=timezone.now)
    TotalValue = models.FloatField(null=False, blank=False, validators=[MinValueValidator(0)])
    PaidValue = models.FloatField(null=False, blank=False, validators=[MinValueValidator(0)])
    RemainingValue = models.FloatField(null=False, blank=False, validators=[MinValueValidator(0)])
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.code

class BookOrder(models.Model):
    OrderId = models.ForeignKey(Order, on_delete=models.CASCADE, null=False, blank=False)
    BookId = models.ForeignKey(Book, on_delete=models.CASCADE, null=False, blank=False)
    Quantity = models.IntegerField(null=False, blank=False, validators=[MinValueValidator(0)])
    UnitSoldPrice = models.FloatField(null=False, blank=False, validators=[MinValueValidator(0)])
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.code