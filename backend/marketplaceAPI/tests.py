from django.test import SimpleTestCase
from graphql_types.types import NFT
from backend.settings import SEPOLIA_MARKETPLACE_ADDRESS
from marketplaceAPI.schema import schema
from graphene.test import Client
from unittest import mock
from web3 import Web3


class SalesTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_sales(self):
        mock_contract_data = [
            ('0x6E11f15b909f6e22801DF6e7742a21cD578D946E',
             '0xe9eFbC61285d75198B3a58794E054C1F6aa44b25', 0, 100000000000000000, 3)
        ]

        w3 = mock.MagicMock()
        w3.eth.contract.return_value = mock.MagicMock()
        w3.eth.contract().functions.getSales().call.return_value = mock_contract_data

        def mock_resolve_NFT(*args, **kwargs):
            return NFT(
                contract_address=args[1],
                token_id=args[2],
                image=f'ipfs://image/{args[2]}',
                name=f'NFT {args[2]}'
            )

        with mock.patch('marketplaceAPI.schema.blockchainProvider', return_value=w3), mock.patch('marketplaceAPI.schema.resolve_NFT', mock_resolve_NFT) as mock_resolve_NFT:
            result = self.client.execute('''
                query {
                    sales(chainId: 11155111) {
                        contractAddress
                        tokenId
                        image
                        name
                    }
                }
            ''')

            # Assertions
            expected_result = {
                'data': {
                    'sales': [
                        {
                            'contractAddress': '0x6E11f15b909f6e22801DF6e7742a21cD578D946E',
                            'tokenId': 0,
                            'image': 'ipfs://image/0',
                            'name': 'NFT 0'
                        },
                    ]
                }
            }

            self.assertEqual(result, expected_result)

    def test_resolve_sales_empty(self):
        mock_contract_data = [
            ('0x6E11f15b909f6e22801DF6e7742a21cD578D946E',
             '0xe9eFbC61285d75198B3a58794E054C1F6aa44b25', 0, 100000000000000000, 1)
        ]

        w3 = mock.MagicMock()
        w3.eth.contract.return_value = mock.MagicMock()
        w3.eth.contract().functions.getSales().call.return_value = mock_contract_data

        def mock_resolve_NFT(*args, **kwargs):
            return NFT(
                contract_address=args[1],
                token_id=args[2],
                image=f'ipfs://image/{args[2]}',
                name=f'NFT {args[2]}'
            )

        with mock.patch('marketplaceAPI.schema.blockchainProvider', return_value=w3), mock.patch('marketplaceAPI.schema.resolve_NFT', mock_resolve_NFT) as mock_resolve_NFT:
            result = self.client.execute('''
                query {
                    sales(chainId: 11155111) {
                        contractAddress
                        tokenId
                        image
                        name
                    }
                }
            ''')

            # Assertions
            expected_result = {
                'data': {
                    'sales': []
                }
            }

            self.assertEqual(result, expected_result)


class SaleTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_sale(self):

        mock_contract_data = ('0x6E11f15b909f6e22801DF6e7742a21cD578D946E',
                              '0xe9eFbC61285d75198B3a58794E054C1F6aa44b25', 0, 1000000000000000000, 1)
        w3 = mock.MagicMock()
        w3.eth.contract.return_value = mock.MagicMock()
        w3.eth.contract().functions.getSale().call.return_value = mock_contract_data

        def mock_resolve_NFT(*args, **kwargs):
            return NFT(
                contract_address=args[1],
                token_id=args[2],
                image=f'ipfs://image/{args[2]}',
                name=f'NFT {args[2]}'
            )

        with mock.patch('marketplaceAPI.schema.blockchainProvider', return_value=w3), mock.patch('marketplaceAPI.schema.resolve_NFT', mock_resolve_NFT) as mock_resolve_NFT:
            result = self.client.execute('''
                query {
                    sale(chainId: 11155111, address: "0x6e11f15b909f6e22801df6e7742a21cd578d946e", tokenId: 0) {
                        nft {
                            contractAddress
                            tokenId
                            image
                            name
                        }
                        seller
                        price
                        status
                    }
                }
            ''')

            expected_result = {
                'data': {
                    'sale': {
                        'nft': {
                            'contractAddress': '0x6E11f15b909f6e22801DF6e7742a21cD578D946E',
                            'tokenId': 0,
                            'image': 'ipfs://image/0',
                            'name': 'NFT 0'
                        },
                        'seller': '0xe9eFbC61285d75198B3a58794E054C1F6aa44b25',
                        'price': 1.0,
                        'status': 1
                    }
                }
            }

            self.assertEqual(result, expected_result)

    def test_resolve_sale_not_exist(self):

        mock_contract_data = ('0x0000000000000000000000000000000000000000',
                              '0x0000000000000000000000000000000000000000', 0, 0, 0)
        w3 = mock.MagicMock()
        w3.eth.contract.return_value = mock.MagicMock()
        w3.eth.contract().functions.getSale().call.return_value = mock_contract_data

        def mock_resolve_NFT(*args, **kwargs):
            return NFT(
                contract_address=args[1],
                token_id=args[2],
                image=f'ipfs://image/{args[2]}',
                name=f'NFT {args[2]}'
            )

        with mock.patch('marketplaceAPI.schema.blockchainProvider', return_value=w3), mock.patch('marketplaceAPI.schema.resolve_NFT', mock_resolve_NFT) as mock_resolve_NFT:
            result = self.client.execute('''
                query {
                    sale(chainId: 11155111, address: "0x6e11f15b909f6e22801df6e7742a21cd578d946e", tokenId: 0) {
                        nft {
                            contractAddress
                            tokenId
                            image
                            name
                        }
                        seller
                        price
                        status
                    }
                }
            ''')

            expected_result = {
                'data': {
                    'sale': None
                }
            }

            self.assertEqual(result, expected_result)


class IsMarketplaceAllowedTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_is_marketplace_allowed_true(self):
        response_data = SEPOLIA_MARKETPLACE_ADDRESS

        w3 = mock.MagicMock()
        w3.eth.contract.return_value = mock.MagicMock()
        w3.eth.contract().functions.getApproved().call.return_value = response_data

        with mock.patch('marketplaceAPI.schema.blockchainProvider', return_value=w3):
            result = self.client.execute(
                ''' query {
                isMarketplaceApproved(chainId: 11155111, address:"0x6E11f15b909f6e22801DF6e7742a21cD578D946E",tokenId: 1)
            }
            ''')

            expected_result = {
                'data': {
                    'isMarketplaceApproved': True
                }
            }

            self.assertEqual(result, expected_result)

    def test_resolve_is_marketplace_allowed_false(self):
        # random address != SEPOLIA_MARKETPLACE_ADDRESS
        response_data = "0x000015b909f6e22801DF6e7742a21cD57800000"

        w3 = mock.MagicMock()
        w3.eth.contract.return_value = mock.MagicMock()
        w3.eth.contract().functions.getApproved().call.return_value = response_data

        with mock.patch('marketplaceAPI.schema.blockchainProvider', return_value=w3):
            result = self.client.execute(
                ''' query {
                isMarketplaceApproved(chainId: 11155111, address:"0x6E11f15b909f6e22801DF6e7742a21cD578D946E",tokenId: 1)
            }
            ''')

            expected_result = {
                'data': {
                    'isMarketplaceApproved': False
                }
            }

            self.assertEqual(result, expected_result)


class IsTokenForSaleTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_is_token_for_sale_true(self):
        response_data = True

        w3 = mock.MagicMock()
        w3.eth.contract.return_value = mock.MagicMock()
        w3.eth.contract().functions.isTokenForSale().call.return_value = response_data

        with mock.patch('marketplaceAPI.schema.blockchainProvider', return_value=w3):
            result = self.client.execute('''
            query {
                isTokenForSale(chainId: 11155111, address:"0x6E11f15b909f6e22801DF6e7742a21cD578D946E",tokenId: 0)
            }
        ''')

            expected_result = {
                'data': {
                    'isTokenForSale': True
                }
            }

            self.assertEqual(result, expected_result)

    def test_resolve_is_token_for_sale_false(self):
        response_data = False

        w3 = mock.MagicMock()
        w3.eth.contract.return_value = mock.MagicMock()
        w3.eth.contract().functions.isTokenForSale().call.return_value = response_data

        with mock.patch('marketplaceAPI.schema.blockchainProvider', return_value=w3):
            result = self.client.execute('''
            query {
                isTokenForSale(chainId: 11155111, address:"0x6E11f15b909f6e22801DF6e7742a21cD578D946E",tokenId: 0)
            }
        ''')

            expected_result = {
                'data': {
                    'isTokenForSale': False
                }
            }

            self.assertEqual(result, expected_result)


class IsAdminTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_is_admin_true(self):
        response_data = "0x6E11f15b909f6e22801DF6e7742a21cD578D946E"

        w3 = mock.MagicMock()
        w3.eth.contract.return_value = mock.MagicMock()
        w3.eth.contract().functions.owner().call.return_value = response_data

        with mock.patch('marketplaceAPI.schema.blockchainProvider', return_value=w3):
            result = self.client.execute('''
                query {
                    isAdmin(chainId: 11155111, address:"0x6E11f15b909f6e22801DF6e7742a21cD578D946E")
                }
            ''')

            expected_result = {
                'data': {
                    'isAdmin': True
                }
            }

            self.assertEqual(result, expected_result)

    def test_resolve_is_admin_false(self):
        response_data = "0x0000f15b909f6e22801DF6e7742a21cD578D0000"

        w3 = mock.MagicMock()
        w3.eth.contract.return_value = mock.MagicMock()
        w3.eth.contract().functions.owner().call.return_value = response_data

        with mock.patch('marketplaceAPI.schema.blockchainProvider', return_value=w3):
            result = self.client.execute('''
                query {
                    isAdmin(chainId: 11155111, address:"0x6E11f15b909f6e22801DF6e7742a21cD578D946E")
                }
            ''')

            expected_result = {
                'data': {
                    'isAdmin': False
                }
            }

            self.assertEqual(result, expected_result)


class MarketplaceRoyaltyTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_marketplace_royalty(self):
        response_data = 100

        w3 = mock.MagicMock()
        w3.eth.contract.return_value = mock.MagicMock()
        w3.eth.contract().functions.getMarketplaceRoyalty().call.return_value = response_data

        with mock.patch('marketplaceAPI.schema.blockchainProvider', return_value=w3):
            result = self.client.execute('''
                query {
                    marketplaceRoyalty(chainId: 11155111)
                }
            ''')

            expected_result = {
                'data': {
                    'marketplaceRoyalty': 1.00
                }
            }

            self.assertEqual(result, expected_result)


class MarketplaceBalanceTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_royalty_value(self):
        response_data = 100

        w3 = mock.MagicMock()
        w3.eth.get_balance().call.return_value = response_data

        with mock.patch('marketplaceAPI.schema.blockchainProvider', return_value=w3):
            with mock.patch('marketplaceAPI.schema.Web3.from_wei', return_value='100') as mock_from_wei:

                result = self.client.execute('''
                    query {
                        marketplaceBalance(chainId: 11155111)
                    }
                ''')

                expected_result = {
                    'data': {
                        'marketplaceBalance': 100
                    }
                }

                self.assertEqual(result, expected_result)
