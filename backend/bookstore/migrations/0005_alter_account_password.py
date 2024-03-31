# Generated by Django 5.0.3 on 2024-03-22 05:42

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookstore', '0004_token'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='Password',
            field=models.TextField(max_length=12, validators=[django.core.validators.RegexValidator('^(?=.*[\\W&&[^ ]]).*$'), django.core.validators.MinLengthValidator(6)]),
        ),
    ]
