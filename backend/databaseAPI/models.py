from django.db import models


class User(models.Model):
    wallet_address = models.CharField(max_length=42, primary_key=True)
    collections = models.ManyToManyField(
        "NFTCollection")

    def __str__(self):
        return self.wallet_address


class NFTCollection(models.Model):
    collection_address = models.CharField(max_length=42, primary_key=True)
    users = models.ManyToManyField(User)

    def __str__(self):
        return self.collection_address


class GeneralCollection(models.Model):
    collection_address = models.CharField(max_length=42, primary_key=True)

    def __str__(self):
        return self.collection_address
