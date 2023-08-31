from graphene.test import Client as GraphQLClient
from django.test import TestCase
from databaseAPI.schema import schema
from databaseAPI.models import NFTCollection, User
from graphene.test import Client


class TestContractObservedQuery(TestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_contract_observed(self):
        # Create a User object and add a NFTCollection to it
        user = User.objects.get_or_create(
            wallet_address="0x963E5DbBcaeEA4c00bab65DdDce727EFd995DEa8")[0]
        nft_collection = NFTCollection.objects.get_or_create(
            collection_address="0xAEb50E72A5B98BE0A7268f1A7c322e75276Aec3F")[0]
        user.collections.add(nft_collection)
        nft_collection.users.add(user)

        # Execute the ContractObserved query
        query = '''
            query {
                contractObserved(address: "0x963E5DbBcaeEA4c00bab65DdDce727EFd995DEa8")
            }
        '''
        result = self.client.execute(query)

        # Assert that the query returns the correct result
        expected_result = {
            "data": {
                "contractObserved": [
                    "0xAEb50E72A5B98BE0A7268f1A7c322e75276Aec3F"
                ]
            }
        }
        self.assertEqual(result, expected_result)


class TestAddUserMutation(TestCase):
    def test_add_user_mutation(self):
        # Create a GraphQL client and execute the AddUser mutation
        client = GraphQLClient(schema)
        mutation = '''
            mutation {
                addUser(address: "0x963E5DbBcaeEA4c00bab65DdDce727EFd995DEa8") {
                    user {
                        walletAddress
                    }
                }
            }
        '''
        result = client.execute(mutation)

        # Assert that the User object was created in the database
        user = User.objects.get(
            wallet_address='0x963E5DbBcaeEA4c00bab65DdDce727EFd995DEa8')
        expected_result = {
            "data": {
                "addUser": {
                    "user": {
                        "walletAddress": user.wallet_address
                    }
                }
            }
        }
        self.assertEqual(result, expected_result)


class TestAddNFTCollectionMutation(TestCase):
    def test_add_nft_collection_mutation(self):
        client = GraphQLClient(schema)
        mutation = '''
        mutation  {
            addNftCollection(
                address:"0xAEb50E72A5B98BE0A7268f1A7c322e75276Aec3F", userAddress:"0xdc113717164435aD887EB5D3b39Ffc549573ebc8"
            ){
                nftCollection{
                collectionAddress
                users{
                    walletAddress
                }
                }
            }
            }
        '''

        result = client.execute(mutation)

        nft_collection = NFTCollection.objects.get(
            collection_address='0xAEb50E72A5B98BE0A7268f1A7c322e75276Aec3F')
        user = User.objects.get(
            wallet_address='0xdc113717164435aD887EB5D3b39Ffc549573ebc8')
        expected_result = {
            "data": {
                "addNftCollection": {
                    "nftCollection": {
                        "collectionAddress": nft_collection.collection_address,
                        "users": [
                            {
                                "walletAddress": user.wallet_address
                            }
                        ]
                    }
                }
            }
        }

        self.assertEqual(result, expected_result)


class TestAddNFTCollectionsMutation(TestCase):
    def test_add_nft_collections_mutation(self):
        client = GraphQLClient(schema)
        mutation = '''
        mutation {
            addNftCollections(
                addresses:["0xAEb50E72A5B98BE0A7268f1A7c322e75276Aec3F", "0x00b50E72A5B98BE0A7268f1A7c322e75276Aec3F"], userAddress:"0xdc113717164435aD887EB5D3b39Ffc549573ebc8"
            ){
                nftCollections{
                collectionAddress
                users{
                    walletAddress
                }
                }
            }
            }
        '''

        result = client.execute(mutation)

        # get all collections
        nft_collection_1 = NFTCollection.objects.get(
            collection_address='0xAEb50E72A5B98BE0A7268f1A7c322e75276Aec3F')
        nft_collection_2 = NFTCollection.objects.get(
            collection_address='0x00b50E72a5b98be0A7268f1A7c322E75276aEC3F')
        user = User.objects.get(
            wallet_address='0xdc113717164435aD887EB5D3b39Ffc549573ebc8')
        expected_result = {
            "data": {
                "addNftCollections": {
                    "nftCollections": [
                        {
                            "collectionAddress": nft_collection_1.collection_address,
                            "users": [
                                {
                                    "walletAddress": user.wallet_address
                                }
                            ]
                        },
                        {
                            "collectionAddress": nft_collection_2.collection_address,
                            "users": [
                                {
                                    "walletAddress": user.wallet_address
                                }
                            ]
                        }
                    ]
                }
            }
        }

        self.assertEqual(result, expected_result)


class TestRemoveNFTCollectionMutation(TestCase):
    def test_remove_nft_collection_mutation(self):
        client = GraphQLClient(schema)

        # Create a User object and add a NFTCollection to it
        user = User.objects.get_or_create(
            wallet_address="0x963E5DbBcaeEA4c00bab65DdDce727EFd995DEa8")[0]
        nft_collection = NFTCollection.objects.get_or_create(
            collection_address="0xAEb50E72A5B98BE0A7268f1A7c322e75276Aec3F")[0]
        user.collections.add(nft_collection)
        nft_collection.users.add(user)

        mutation = '''
        mutation {
            removeNftCollection(
                address:"0xAEb50E72A5B98BE0A7268f1A7c322e75276Aec3F", userAddress:"0x963E5DbBcaeEA4c00bab65DdDce727EFd995DEa8"
            ){
                nftCollection{
                collectionAddress
                users{
                    walletAddress
                }
                }
            }
        }
        '''

        result = client.execute(mutation)

        expected_result = {
            "data": {
                "removeNftCollection": {
                    "nftCollection": {
                        "collectionAddress": nft_collection.collection_address,
                        "users": []
                    }
                }
            }
        }

        self.assertEqual(result, expected_result)


class TestRemoveNFTCollectionsMutation(TestCase):
    def test_remove_nft_collections_mutation(self):
        # Create a User object and add a NFTCollection to it
        user = User.objects.get_or_create(
            wallet_address="0x963E5DbBcaeEA4c00bab65DdDce727EFd995DEa8")[0]
        nft_collection1 = NFTCollection.objects.get_or_create(
            collection_address="0xAEb50E72A5B98BE0A7268f1A7c322e75276Aec3F")[0]
        nft_collection2 = NFTCollection.objects.get_or_create(
            collection_address="0x00b50E72a5b98be0A7268f1A7c322E75276aEC3F")[0]
        user.collections.add(nft_collection1)
        user.collections.add(nft_collection2)
        nft_collection1.users.add(user)
        nft_collection2.users.add(user)

        client = GraphQLClient(schema)
        mutation = '''
        mutation {
            removeNftCollections(
                addresses:["0xAEb50E72A5B98BE0A7268f1A7c322e75276Aec3F", "0x00b50E72a5b98be0A7268f1A7c322E75276aEC3F"], userAddress:"0x963E5DbBcaeEA4c00bab65DdDce727EFd995DEa8"
            ){
                nftCollections{
                collectionAddress
                users{
                    walletAddress
                }
                }
            }
            }
        '''

        result = client.execute(mutation)
        expected_result = {
            "data": {
                "removeNftCollections": {
                    "nftCollections": [
                        {
                            "collectionAddress": nft_collection1.collection_address,
                            "users": []
                        },
                        {
                            "collectionAddress": nft_collection2.collection_address,
                            "users": []
                        }
                    ]
                }
            }
        }

        self.assertEqual(result, expected_result)
