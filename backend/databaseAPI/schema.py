from databaseAPI.models import NFTCollection, User
import graphene
from graphene_django import DjangoObjectType
from web3 import Web3
import requests


#########
# Query #
#########


class Query(graphene.ObjectType):
    contract_observed = graphene.Field(
        graphene.List(graphene.String),
        args={
            'address': graphene.Argument(graphene.String, required=True)
        }
    )

    def resolve_contract_observed(self, info, address):
        user = User.objects.get_or_create(wallet_address=address)[0]
        contracts = user.collections.all()
        return [contract.collection_address for contract in contracts]


############
# Mutation #
############

class AddUserType(DjangoObjectType):
    class Meta:
        model = User


class AddUser(graphene.Mutation):
    class Arguments:
        address = graphene.String(required=True)

    user = graphene.Field(AddUserType)

    def mutate(self, info, address):
        address_checksum = Web3.to_checksum_address(address)
        user = User.objects.get_or_create(wallet_address=address_checksum)[0]
        return AddUser(user=user)


class NFTCollectionType(DjangoObjectType):
    class Meta:
        model = NFTCollection


class AddNFTCollection(graphene.Mutation):
    class Arguments:
        address = graphene.String(required=True)
        user_address = graphene.String(required=True)

    nft_collection = graphene.Field(NFTCollectionType)

    def mutate(self, info, address, user_address):
        address_checksum = Web3.to_checksum_address(address)
        user_address_checksum = Web3.to_checksum_address(user_address)

        user = User.objects.get_or_create(
            wallet_address=user_address_checksum)[0]
        nft_collection = NFTCollection.objects.get_or_create(
            collection_address=address_checksum)[0]

        if nft_collection not in user.collections.all():
            user.collections.add(nft_collection)
            nft_collection.users.add(user)

        nft_collection_return = NFTCollectionType(
            collection_address=address_checksum,
            users=nft_collection.users.all()
        )

        return AddNFTCollection(nft_collection=nft_collection_return)


class AddNFTCollections(graphene.Mutation):
    class Arguments:
        addresses = graphene.List(graphene.String, required=True)
        user_address = graphene.String(required=True)

    nft_collections = graphene.List(NFTCollectionType)

    def mutate(self, info, addresses, user_address):
        user_address_checksum = Web3.to_checksum_address(user_address)
        user = User.objects.get_or_create(
            wallet_address=user_address_checksum)[0]

        nft_collections = []
        for address in addresses:
            address_checksum = Web3.to_checksum_address(address)
            nft_collection = NFTCollection.objects.get_or_create(
                collection_address=address_checksum)[0]
            if nft_collection not in user.collections.all():
                user.collections.add(nft_collection)
                nft_collection.users.add(user)
            nft_collections.append(nft_collection)

        nft_collections_return = []
        for nft_collection in nft_collections:
            nft_collections_return.append(NFTCollectionType(
                collection_address=nft_collection.collection_address,
                users=nft_collection.users.all()
            ))

        return AddNFTCollections(nft_collections=nft_collections_return)


class RemoveNFTCollection(graphene.Mutation):
    class Arguments:
        address = graphene.String(required=True)
        user_address = graphene.String(required=True)

    nft_collection = graphene.Field(NFTCollectionType)

    def mutate(self, info, address, user_address):
        address_checksum = Web3.to_checksum_address(address)
        user_address_checksum = Web3.to_checksum_address(user_address)

        user = User.objects.get_or_create(
            wallet_address=user_address_checksum)[0]
        nft_collection = NFTCollection.objects.get_or_create(
            collection_address=address_checksum)[0]

        if nft_collection in user.collections.all():
            user.collections.remove(nft_collection)
            nft_collection.users.remove(user)

        nft_collection_return = NFTCollectionType(
            collection_address=address_checksum,
            users=nft_collection.users.all()
        )

        return AddNFTCollection(nft_collection=nft_collection_return)


class RemoveNFTCollections(graphene.Mutation):
    class Arguments:
        addresses = graphene.List(graphene.String, required=True)
        user_address = graphene.String(required=True)

    nft_collections = graphene.List(NFTCollectionType)

    def mutate(self, info, addresses, user_address):
        user_address_checksum = Web3.to_checksum_address(user_address)
        user = User.objects.get_or_create(
            wallet_address=user_address_checksum)[0]

        nft_collections = []
        for address in addresses:
            address_checksum = Web3.to_checksum_address(address)
            nft_collection = NFTCollection.objects.get_or_create(
                collection_address=address_checksum)[0]
            if nft_collection in user.collections.all():
                user.collections.remove(nft_collection)
                nft_collection.users.remove(user)
            nft_collections.append(nft_collection)

        nft_collections_return = []
        for nft_collection in nft_collections:
            nft_collections_return.append(NFTCollectionType(
                collection_address=nft_collection.collection_address,
                users=nft_collection.users.all()
            ))

        return AddNFTCollections(nft_collections=nft_collections_return)


class Mutation(graphene.ObjectType):
    add_user = AddUser.Field()
    add_nft_collection = AddNFTCollection.Field()
    add_nft_collections = AddNFTCollections.Field()
    remove_nft_collection = RemoveNFTCollection.Field()
    remove_nft_collections = RemoveNFTCollections.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
