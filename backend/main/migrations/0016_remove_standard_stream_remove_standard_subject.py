# Generated by Django 5.1 on 2024-09-02 07:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0015_lecture_subject'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='standard',
            name='stream',
        ),
        migrations.RemoveField(
            model_name='standard',
            name='subject',
        ),
    ]
