# Generated by Django 5.1 on 2024-09-12 10:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0029_alter_libasset_is_verified'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='language',
            field=models.CharField(default=1, max_length=200),
            preserve_default=False,
        ),
    ]
