# Generated by Django 5.1 on 2024-09-08 09:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0023_libasset_uuid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lecture',
            name='is_verified',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='libasset',
            name='is_verified',
            field=models.BooleanField(default=True),
        ),
    ]
