# Generated by Django 4.1.9 on 2023-08-10 11:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('databaseAPI', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='GeneralCollection',
            fields=[
                ('collection_address', models.CharField(max_length=42, primary_key=True, serialize=False)),
            ],
        ),
    ]
