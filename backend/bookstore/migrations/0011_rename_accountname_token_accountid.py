# Generated by Django 5.0.3 on 2024-03-23 01:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bookstore', '0010_alter_account_password'),
    ]

    operations = [
        migrations.RenameField(
            model_name='token',
            old_name='AccountName',
            new_name='AccountId',
        ),
    ]
