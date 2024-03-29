# Generated by Django 5.0.3 on 2024-03-21 13:39

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookstore', '0003_remove_bookorder_date_remove_bookstorage_date_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Token',
            fields=[
                ('Key', models.TextField(max_length=100, primary_key=True, serialize=False)),
                ('Created', models.DateTimeField(default=django.utils.timezone.now)),
                ('AccountName', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bookstore.account')),
            ],
        ),
    ]
