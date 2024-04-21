from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from ..validators.models_validator import ConsumerValidator

class Consumer(models.Model):
    ConsumerId = models.AutoField(primary_key=True)
    Name = models.TextField(max_length=255, null=False, blank=False)
    Address = models.TextField(max_length=255, null=False, blank=False)
    Phone = models.TextField(max_length=11, null=False, blank=False, validators=[ConsumerValidator.Phone])
    Email = models.EmailField(max_length=320, null=True, blank=True)
    Debt = models.FloatField(default=0, null=False, blank=False, validators=[MinValueValidator(0)])
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return str(self.ConsumerId)