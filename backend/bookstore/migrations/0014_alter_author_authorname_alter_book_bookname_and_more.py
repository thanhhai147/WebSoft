# Generated by Django 5.0.3 on 2024-06-12 13:20

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("bookstore", "0013_parameter_active"),
    ]

    operations = [
        migrations.AlterField(
            model_name="author",
            name="AuthorName",
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name="book",
            name="BookName",
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name="booktype",
            name="BookTypeName",
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name="consumer",
            name="Address",
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name="consumer",
            name="Email",
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AlterField(
            model_name="consumer",
            name="Name",
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name="consumer",
            name="Phone",
            field=models.TextField(
                validators=[
                    django.core.validators.RegexValidator(
                        "(84|0[3|5|7|8|9])+([0-9]{8})\\b"
                    )
                ]
            ),
        ),
    ]
