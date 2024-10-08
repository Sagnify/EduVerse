# Generated by Django 5.0.4 on 2024-08-27 07:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0007_alter_userprofilestudent_profile_pic_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofilestudent',
            name='address',
            field=models.TextField(default='', null=True),
        ),
        migrations.AlterField(
            model_name='userprofilestudent',
            name='gender',
            field=models.CharField(default=' ', max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='userprofilestudent',
            name='phone_number',
            field=models.CharField(default=' ', max_length=15, null=True),
        ),
        migrations.AlterField(
            model_name='userprofilestudent',
            name='standard',
            field=models.CharField(default=' ', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='userprofilestudent',
            name='stream',
            field=models.CharField(default=' ', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='userprofileteacher',
            name='bio',
            field=models.TextField(default=' ', null=True),
        ),
        migrations.AlterField(
            model_name='userprofileteacher',
            name='phone_number',
            field=models.CharField(default=' ', max_length=15, null=True),
        ),
    ]
