from django.db import models
from django.utils import timezone
from django.core.validators import MinLengthValidator
from ..validators.models_validator import AccountValidator

class Account(models.Model):
    AccountId = models.AutoField(primary_key=True)
    AccountName = models.TextField(max_length=12, null=False, blank=False, validators=[AccountValidator.AccountName, MinLengthValidator(6)])
    Password = models.TextField(max_length=255, null=False, blank=False)
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return str(self.AccountId)

class Token(models.Model):
    Key = models.TextField(primary_key=True, max_length=100)
    AccountId = models.ForeignKey(Account, on_delete=models.CASCADE, null=False, blank=False)
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return str(self.Key)