# Generated by Django 5.0.3 on 2024-03-19 12:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bookstore', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='account',
            old_name='created',
            new_name='Created',
        ),
        migrations.RenameField(
            model_name='author',
            old_name='created',
            new_name='Created',
        ),
        migrations.RenameField(
            model_name='book',
            old_name='created',
            new_name='Created',
        ),
        migrations.RenameField(
            model_name='bookorder',
            old_name='created',
            new_name='Created',
        ),
        migrations.RenameField(
            model_name='bookstorage',
            old_name='created',
            new_name='Created',
        ),
        migrations.RenameField(
            model_name='booktype',
            old_name='created',
            new_name='Created',
        ),
        migrations.RenameField(
            model_name='consumer',
            old_name='created',
            new_name='Created',
        ),
        migrations.RenameField(
            model_name='order',
            old_name='created',
            new_name='Created',
        ),
        migrations.RenameField(
            model_name='parameter',
            old_name='created',
            new_name='Created',
        ),
        migrations.RenameField(
            model_name='payment',
            old_name='created',
            new_name='Created',
        ),
        migrations.RenameField(
            model_name='storage',
            old_name='created',
            new_name='Created',
        ),
    ]
