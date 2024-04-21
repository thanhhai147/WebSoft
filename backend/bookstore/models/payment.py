from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from .consumer import Consumer

class Payment(models.Model):
    PaymentId = models.AutoField(primary_key=True)
    ConsumerId = models.ForeignKey(Consumer, on_delete=models.CASCADE, null=False, blank=False)
    Date = models.DateField(default=timezone.now)
    Value = models.FloatField(null=False, blank=False, validators=[MinValueValidator(0)])
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return str(self.PaymentId)