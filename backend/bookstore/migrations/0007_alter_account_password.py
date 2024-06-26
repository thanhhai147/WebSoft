# Generated by Django 5.0.3 on 2024-03-22 05:46

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookstore', '0006_alter_account_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='Password',
            field=models.TextField(max_length=12, validators=[django.core.validators.RegexValidator('^(?=.{6,})(?=.*[a-z]+)(?=.*\\d+)(?=.*[A-Z]+)[ -~]*$'), django.core.validators.MinLengthValidator(6)]),
        ),
    ]
