from django.db import models
from django.utils import timezone

class Parameter(models.Model):
    ParameterName = models.TextField(primary_key=True)
    Value = models.FloatField(null=False, blank=False)
    Active = models.BooleanField(null=False, blank=False, default=True)
    Created = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return str(self.ParameterName)