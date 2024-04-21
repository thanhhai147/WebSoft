from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator

class BookType(models.Model):
    BookTypeId = models.AutoField(primary_key=True)
    BookTypeName = models.TextField(max_length=255, null=False, blank=False)
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return str(self.BookTypeId)
    
class Author(models.Model):
    AuthorId = models.AutoField(primary_key=True)
    AuthorName = models.TextField(max_length=255, null=False, blank=False)
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return str(self.AuthorId)
    
class Book(models.Model):
    BookId = models.AutoField(primary_key=True)
    BookName = models.TextField(max_length=255, null=False, blank=False)
    BookTypeId = models.ForeignKey(BookType, on_delete=models.CASCADE, null=False, blank=False)
    AuthorId = models.ForeignKey(Author, on_delete=models.CASCADE, null=False, blank=False)
    Quantity = models.IntegerField(default=0, null=False, blank=False, validators=[MinValueValidator(0)])
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return str(self.BookId)