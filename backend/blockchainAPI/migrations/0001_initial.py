# Generated by Django 4.1.9 on 2023-08-09 07:47

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('wallet_address', models.CharField(max_length=42, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='NFTCollection',
            fields=[
                ('collection_address', models.CharField(max_length=42, primary_key=True, serialize=False)),
                ('users', models.ManyToManyField(to='blockchainAPI.user')),
            ],
        ),
    ]
