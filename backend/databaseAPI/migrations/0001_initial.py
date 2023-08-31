# Generated by Django 4.1.9 on 2023-08-09 08:27

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='NFTCollection',
            fields=[
                ('collection_address', models.CharField(max_length=42, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('wallet_address', models.CharField(max_length=42, primary_key=True, serialize=False)),
                ('collections', models.ManyToManyField(to='databaseAPI.nftcollection')),
            ],
        ),
        migrations.AddField(
            model_name='nftcollection',
            name='users',
            field=models.ManyToManyField(to='databaseAPI.user'),
        ),
    ]
