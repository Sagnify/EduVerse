# Generated by Django 5.1 on 2024-09-02 07:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0017_alter_lecture_asset_sel'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lecture',
            name='rating',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=3),
        ),
    ]
