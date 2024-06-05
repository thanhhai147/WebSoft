from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator

class BookType(models.Model):
    BookTypeId = models.AutoField(primary_key=True)
    BookTypeName = models.TextField(null=False, blank=False)
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return str(self.BookTypeId)
    
class Author(models.Model):
    AuthorId = models.AutoField(primary_key=True)
    AuthorName = models.TextField(null=False, blank=False)
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return str(self.AuthorId)
    
class Book(models.Model):
    BookId = models.AutoField(primary_key=True)
    BookName = models.TextField(null=False, blank=False)
    BookTypeId = models.ForeignKey(BookType, on_delete=models.SET_NULL, null=True, blank=False)
    AuthorId = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True, blank=False)
    Quantity = models.IntegerField(default=0, null=False, blank=False, validators=[MinValueValidator(0)])
    Active = models.BooleanField(default=False, null=False, blank=False)
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return str(self.BookId)