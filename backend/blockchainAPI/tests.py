from django.test import SimpleTestCase
from blockchainAPI.schema import Query
from blockchainAPI.schema import schema
from blockchainAPI.schema import ZERO_ADDRESS
from graphene.test import Client
from unittest import mock
from web3 import Web3
from datetime import datetime
from graphql_types.types import NFT


class OwnedNftsTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_owned_nfts(self):

        w3 = mock.MagicMock()
        contract = mock.MagicMock()

        # Mock the return value of the get_logs method based on the input parameters
        def mock_get_logs(*args, **kwargs):
            if kwargs.get('argument_filters', {}).get('to') == '0x0000000001':
                return [
                    {'args': {'tokenId': 1, 'from': '0x0', 'to': '0x0000000001'},
                        'blockNumber': 1, 'transactionIndex': 1},
                    {'args': {'tokenId': 2, 'from': '0x0', 'to': '0x0000000001'},
                        'blockNumber': 1, 'transactionIndex': 2},
                ]
            elif kwargs.get('argument_filters', {}).get('from') == '0x0000000001':
                return [{'args': {'tokenId': 2, 'from': '0x0000000001', 'to': '0x0'}, 'blockNumber': 2, 'transactionIndex': 1}]
            else:
                return []

        contract.events.Transfer.get_logs.side_effect = mock_get_logs
        w3.eth.contract.return_value = contract

        def mock_resolve_NFT(*args, **kwargs):
            return NFT(
                contract_address=args[1],
                token_id=args[2],
                image=f'ipfs://image/{args[2]}',
                name=f'NFT {args[2]}'
            )

        with mock.patch('blockchainAPI.schema.NFTCollection.objects.filter') as mock_nft_collection_filter, \
                mock.patch('blockchainAPI.schema.GeneralCollection.objects.all') as mock_general_collection_all, mock.patch('blockchainAPI.schema.blockchainProvider', return_value=w3), \
                mock.patch('blockchainAPI.schema.resolve_NFT', mock_resolve_NFT) as mock_resolve_NFT:

            mock_nft_collection_filter.return_value.values_list.return_value = [
                '0x6E11f15b909f6e22801DF6e7742a21cD578D946E']
            mock_general_collection_all.return_value.values_list.return_value = [
                '0x6E11f15b909f6e22801DF6e7742a21cD578D946E']
            result = self.client.execute('''
                query {
                    ownedNfts(chainId: 11155111, address: "0x0000000001") {
                        contractAddress
                        tokenId
                        image
                        name
                    }
                }
            ''')

            expected_result = {
                "data": {
                    "ownedNfts": [
                        {
                            "contractAddress": "0x6E11f15b909f6e22801DF6e7742a21cD578D946E",
                            "tokenId": 1,
                            "image": "ipfs://image/1",
                            "name": "NFT 1"
                        }
                    ]
                }
            }

            self.assertEqual(result, expected_result)


class NFTCompleteTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_nft_complete(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.tokenURI().call.return_value = "tokenURI"

        def supportInterface(*args, **kwargs):
            if args[0] == "0x80ac58cd":
                return True
            else:
                return False
        contract.functions.supportsInterface.call.side_effect = supportInterface
        contract.functions.ownerOf().call.return_value = "0x965A25dA356e75a58bEBEEA63C3050540259adB2"
        contract.functions.name().call.return_value = "TestName"
        contract.functions.symbol().call.return_value = "TestSymbol"
        w3.eth.contract.return_value = contract

        requests = mock.MagicMock()
        requests.get.return_value.json.return_value = {
            'name': 'NFT 1',
            'image': 'ipfs://image1',
            'description': 'description',
            "attributes": [
                {
                    "trait_type": "background",
                    "value": "red"
                },
                {
                    "trait_type": "eyes",
                    "value": "blue"
                }
            ]
        }

        with mock.patch('blockchainAPI.schema.blockchainProvider', return_value=w3), mock.patch('blockchainAPI.schema.requests', requests):
            result = self.client.execute('''
                    query nftComplete {
                        nftComplete(chainId: 11155111, address:"0x6E11f15b909f6e22801DF6e7742a21cD578D946E", tokenId:0) {
                            nft {
                                contractAddress
                                tokenId
                                image
                                name
                            }
                            contract {
                                name
                                symbol
                                address
                            }
                            attributes {
                                traitType
                                value
                            }
                            owner
                            description
                            tokenType
                        }
                    }
                    ''')

            expected_result = {
                "data": {
                    "nftComplete": {
                        "nft": {
                            "contractAddress": "0x6E11f15b909f6e22801DF6e7742a21cD578D946E",
                            "tokenId": 0,
                            "image": "https://ipfs.io/ipfs/image1",
                            "name": "NFT 1"
                        },
                        "contract": {
                            "name": "TestName",
                            "symbol": "TestSymbol",
                            "address": "0x6E11f15b909f6e22801DF6e7742a21cD578D946E"
                        },
                        "attributes": [
                            {
                                "traitType": "background",
                                "value": "red"
                            },
                            {
                                "traitType": "eyes",
                                "value": "blue"
                            }
                        ],
                        "owner": "0x965A25dA356e75a58bEBEEA63C3050540259adB2",
                        "description": "description",
                        "tokenType": "ERC721"
                    }
                }
            }

            self.assertEqual(result, expected_result)

    def test_resolve_nft_complete_erc1155(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.tokenURI().call.return_value = "tokenURI"

        def supportInterface(*args, **kwargs):
            returnFunc = mock.MagicMock()
            returnFunc.call.return_value = False
            if args[0] == "0xd9b67a26":
                returnFunc.call.return_value = True
            else:
                returnFunc.call.return_value = False
            return returnFunc

        contract.functions.supportsInterface.side_effect = supportInterface

        contract.functions.ownerOf().call.return_value = "0x965A25dA356e75a58bEBEEA63C3050540259adB2"
        contract.functions.name().call.return_value = "TestName"
        contract.functions.symbol().call.return_value = "TestSymbol"
        w3.eth.contract.return_value = contract

        requests = mock.MagicMock()
        requests.get.return_value.json.return_value = {
            'name': 'NFT 1',
            'image': 'ipfs://image1',
            'description': 'description',
            "attributes": [
                {
                    "trait_type": "background",
                    "value": "red"
                },
                {
                    "trait_type": "eyes",
                    "value": "blue"
                }
            ]
        }

        with mock.patch('blockchainAPI.schema.blockchainProvider', return_value=w3), mock.patch('blockchainAPI.schema.requests', requests):
            result = self.client.execute('''
                    query nftComplete {
                        nftComplete(chainId: 11155111, address:"0x6E11f15b909f6e22801DF6e7742a21cD578D946E", tokenId:0) {
                            nft {
                                contractAddress
                                tokenId
                                image
                                name
                            }
                            contract {
                                name
                                symbol
                                address
                            }
                            attributes {
                                traitType
                                value
                            }
                            owner
                            description
                            tokenType
                        }
                    }
                    ''')

            expected_result = {
                "data": {
                    "nftComplete": {
                        "nft": {
                            "contractAddress": "0x6E11f15b909f6e22801DF6e7742a21cD578D946E",
                            "tokenId": 0,
                            "image": "https://ipfs.io/ipfs/image1",
                            "name": "NFT 1"
                        },
                        "contract": {
                            "name": "TestName",
                            "symbol": "TestSymbol",
                            "address": "0x6E11f15b909f6e22801DF6e7742a21cD578D946E"
                        },
                        "attributes": [
                            {
                                "traitType": "background",
                                "value": "red"
                            },
                            {
                                "traitType": "eyes",
                                "value": "blue"
                            }
                        ],
                        "owner": "0x965A25dA356e75a58bEBEEA63C3050540259adB2",
                        "description": "description",
                        "tokenType": "ERC1155"
                    }
                }
            }

            self.assertEqual(result, expected_result)


class CollectionTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_collection(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.name().call.return_value = "TestName"
        contract.functions.symbol().call.return_value = "TestSymbol"

        # Mock the return value of the get_logs method based on the input parameters

        def mock_get_logs(*args, **kwargs):
            if kwargs.get('argument_filters', {}).get('from') == ZERO_ADDRESS:
                return [
                    {'args': {'tokenId': 1, 'from': ZERO_ADDRESS, 'to': '0x0000000001'},
                        'blockNumber': 1, 'transactionIndex': 1},
                    {'args': {'tokenId': 2, 'from': ZERO_ADDRESS, 'to': '0x0000000001'},
                        'blockNumber': 1, 'transactionIndex': 2},
                ]
            elif kwargs.get('argument_filters', {}).get('to') == ZERO_ADDRESS:
                return [{'args': {'tokenId': 2, 'from': '0x0000000001', 'to': ZERO_ADDRESS}, 'blockNumber': 2, 'transactionIndex': 1}]
            else:
                return []

        def mock_resolve_NFT(*args, **kwargs):
            return NFT(
                contract_address=args[1],
                token_id=args[2],
                image=f'ipfs://image/{args[2]}',
                name=f'NFT {args[2]}'
            )

        contract.events.Transfer.get_logs.side_effect = mock_get_logs
        w3.eth.contract.return_value = contract
        with mock.patch('blockchainAPI.schema.blockchainProvider', return_value=w3), mock.patch('blockchainAPI.schema.resolve_NFT', mock_resolve_NFT) as mock_resolve_NFT:
            result = self.client.execute('''
            query {
            collection(chainId: 11155111, address:"0x1655e7FD801E9AA93e88Fa69f6D08D389AA8CD14"){
                contract {
                    name
                    symbol
                    address
                }
                nfts {
                    name
                    tokenId
                    image
                }
            }
            }
            ''')

            expected_result = {
                "data": {
                    "collection": {
                        "contract": {
                            "name": "TestName",
                            "symbol": "TestSymbol",
                            "address": "0x1655e7FD801E9AA93e88Fa69f6D08D389AA8CD14"
                        },
                        "nfts": [
                            {
                                "name": "NFT 1",
                                "tokenId": 1,
                                "image": "ipfs://image/1"
                            }
                        ]
                    }
                }
            }

            self.assertEqual(result, expected_result)


class ContractTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_contract(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.name().call.return_value = "TestName"
        contract.functions.symbol().call.return_value = "TestSymbol"
        w3.eth.contract.return_value = contract

        with mock.patch('blockchainAPI.schema.blockchainProvider', return_value=w3):
            result = self.client.execute('''
            query {
                contract(chainId: 11155111, address: "0x1655e7FD801E9AA93e88Fa69f6D08D389AA8CD14") {
                    address
                    name
                    symbol
                }
                }
            ''')

            expected_result = {
                "data": {
                    "contract": {
                        "address": "0x1655e7FD801E9AA93e88Fa69f6D08D389AA8CD14",
                        "name": "TestName",
                        "symbol": "TestSymbol"
                    }
                }
            }

            self.assertEqual(result, expected_result)


class NFTHistoryTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_nft_history(self):

        mock_events_transfer = [
            {  # mint
                "event": "Transfer",
                "blockNumber": 1,
                "args": {
                    "from": "0x0000000000000000000000000000000000000000",
                    "to": "0x1111111"
                }
            },
            {  # transfer
                "event": "Transfer",
                "blockNumber": 1,
                "args": {
                    "from": "0x1111111",
                    "to": "0x2222222"
                }
            },
            {  # burn
                "event": "Transfer",
                "blockNumber": 1,
                "args": {
                    "from": "0x2222222",
                    "to": "0x0000000000000000000000000000000000000000"
                }
            },
            {
                # other events
                "event": "Other",
                "blockNumber": 1,
            }
        ]

        mock_events_approval = [
            {  # approval
                "event": "Approval",
                "blockNumber": 1,
                "args": {
                    "owner": "0x1111111",
                    "approved": "0x2222222"
                }
            },
        ]

        mock_events_approval_for_all = [
            {  # approval for all
                "event": "ApprovalForAll",
                "blockNumber": 1,
                "args": {
                    "owner": "0x1111111",
                    "operator": "0x2222222",
                    "approved": True
                }
            },
        ]

        mock_events_sale_created = [
            {  # sale created
                "event": "SaleCreated",
                "blockNumber": 1,
                "args": {
                    "seller": "0x1111111",
                    "price": 1000000000000000000,
                }
            }
        ]

        mock_events_sale_bought = [
            {  # sale bought
                "event": "SaleBought",
                "blockNumber": 1,
                "args": {
                    "seller": "0x1111111",
                    "buyer": "0x2222222",
                    "price": 1000000000000000000,
                }
            }
        ]

        mock_events_sale_cancelled = [
            {  # sale cancelled
                "event": "SaleCancelled",
                "blockNumber": 1,
                "args": {
                    "seller": "0x1111111",
                }
            }
        ]

        mock_events_sale_price_modified = [
            {
                "event": "SalePriceModified",
                "blockNumber": 1,
                "args": {
                    "seller": "0x1111111",
                    "price": 1000000000000000000,
                    "previousPrice": 2000000000000000000
                }
            }
        ]

        w3 = mock.MagicMock()
        w3.eth.get_block.return_value = {
            "timestamp": 1629225600
        }

        w3.eth.contract().events.Transfer.get_logs = mock.MagicMock(
            return_value=mock_events_transfer)

        w3.eth.contract().events.Approval.get_logs = mock.MagicMock(
            return_value=mock_events_approval)

        w3.eth.contract().events.ApprovalForAll.get_logs = mock.MagicMock(
            return_value=mock_events_approval_for_all)

        w3.eth.contract().events.SaleCreated.get_logs = mock.MagicMock(
            return_value=mock_events_sale_created)

        w3.eth.contract().events.SaleBought.get_logs = mock.MagicMock(
            return_value=mock_events_sale_bought)

        w3.eth.contract().events.SaleCancelled.get_logs = mock.MagicMock(
            return_value=mock_events_sale_cancelled)

        w3.eth.contract().events.SalePriceModified.get_logs = mock.MagicMock(
            return_value=mock_events_sale_price_modified)

        with mock.patch('blockchainAPI.schema.blockchainProvider', return_value=w3):

            result = self.client.execute('''
               query  {
                nftHistory(chainId: 11155111, address: "0x1203A6e8bD6A063AEa9D4B7F8A2BaE9405fE44Cd", tokenId:1) {
                    __typename
                    ... on EventTransfer {
                        date
                        fromAddress
                        toAddress
                    }
                    ... on EventApproval {
                        date
                        owner
                        approved
                    }
                    ... on EventApprovalForAll {
                        date
                        owner
                        isApproved
                        operator
                    }
                    ... on EventMint {
                        date
                        toAddress
                    }
                    ... on EventBurn {
                        date
                        fromAddress
                    }
                    ... on EventSaleCreated {
                        date
                        seller
                        price
                    }
                    ... on EventSaleBought {
                        date
                        seller
                        buyer
                        price
                    }
                    ... on EventSaleCancelled {
                        date
                        seller
                    }
                    ... on EventSalePriceModified {
                        date
                        seller
                        previousPrice
                        price
                    }
                }
            }
            ''')

            expected_result = {
                'data':
                {'nftHistory':
                 [
                     {'__typename': 'EventMint', 'date': '1629225600',
                      'toAddress': '0x1111111'},
                     {'__typename': 'EventTransfer', 'date': '1629225600',
                      'fromAddress': '0x1111111', 'toAddress': '0x2222222'},
                     {'__typename': 'EventBurn', 'date': '1629225600',
                      'fromAddress': '0x2222222'},
                     {'__typename': 'EventApproval', 'date': '1629225600',
                      'owner': '0x1111111', 'approved': '0x2222222'},
                     {'__typename': 'EventApprovalForAll', 'date': '1629225600',
                      'owner': '0x1111111', 'isApproved': True, 'operator': '0x2222222'},
                     {'__typename': 'EventSaleCreated', 'date': '1629225600',
                      'seller': '0x1111111', 'price': 1.0},
                     {'__typename': 'EventSaleBought', 'date': '1629225600',
                      'seller': '0x1111111', 'buyer': '0x2222222', 'price': 1.0},
                     {'__typename': 'EventSaleCancelled',
                      'date': '1629225600', 'seller': '0x1111111'},
                     {'__typename': 'EventSalePriceModified', 'date': '1629225600',
                      'seller': '0x1111111', 'previousPrice': 2.0, 'price': 1.0}
                 ]
                 }
            }

            self.assertEqual(result, expected_result)


class RoyaltyCollectionTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_royalty_collection(self):
        resolve_royalties_collection_return_value = {
            "supported_interface_erc2981": True,
            "supported_interface_erc2981_multi_receiver": True,
            "royalties": [
                {
                    "receiver": "0x1111111",
                    "share": 1
                },
                {
                    "receiver": "0x2222222",
                    "share": 2
                }],
            "royalty_sum": 3,
            "payment_splitter_address": "mockedAddress"
        }

        with mock.patch('blockchainAPI.schema.resolve_royalties_collection', return_value=resolve_royalties_collection_return_value):
            result = self.client.execute('''
            query  {
                royaltyCollection(chainId: 11155111 ,address: "0x1655e7FD801E9AA93e88Fa69f6D08D389AA8CD14") {
                    hasPaymentSplitter
                    royalties {
                        receiver
                        share
                    }
                    royaltySum
                    supportsErc2981
                    supportsErc2981MultiReceiver
                }
            }
            ''')

            expected_result = {
                "data": {
                    "royaltyCollection": {
                        "hasPaymentSplitter": True,
                        "royalties": [
                            {
                                "receiver": "0x1111111",
                                "share": 1.0
                            },
                            {
                                "receiver": "0x2222222",
                                "share": 2.0
                            }
                        ],
                        "royaltySum": 3.0,
                        "supportsErc2981": True,
                        "supportsErc2981MultiReceiver": True
                    }
                }
            }

            self.assertEqual(result, expected_result)


class WithdrawRoyaltyCollectionTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_royalty_collection(self):
        resolve_royalties_collection_return_value = {
            "supported_interface_erc2981": True,
            "supported_interface_erc2981_multi_receiver": True,
            "royalties": [
                {
                    "receiver": "0xAAAAA",
                    "share": 3
                },
            ],
            "royalty_sum": 3,
            "payment_splitter_address": "mockedAddress"
        }

        get_payment_splitter_royalties_return_value = [
            {
                "receiver": "0x1111111",
                "amount": 1
            },
            {
                "receiver": "0x2222222",
                "amount": 2
            }
        ]

        with mock.patch('blockchainAPI.schema.resolve_royalties_collection', return_value=resolve_royalties_collection_return_value), \
                mock.patch('blockchainAPI.schema.get_payment_splitter_royalties', return_value=get_payment_splitter_royalties_return_value):
            result = self.client.execute('''
            query {
            withdrawRoyaltyCollection(chainId: 11155111, address: "0xAEb50E72A5B98BE0A7268f1A7c322e75276Aec3F") {
                paymentSplitterAddress
                receivers {
                receiver
                amount
                }
            }
            }
            ''')

            expected_result = {
                "data": {
                    "withdrawRoyaltyCollection": {
                        "paymentSplitterAddress": "mockedAddress",
                        "receivers": [
                            {
                                "receiver": "0x1111111",
                                "amount": 1.0
                            },
                            {
                                "receiver": "0x2222222",
                                "amount": 2.0
                            }
                        ]
                    }
                }
            }

            self.assertEqual(result, expected_result)


class RoyaltyTokenTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_royalty_token(self):
        resolve_royalties_token_return_value = {
            "supported_interface_erc2981": True,
            "supported_interface_erc2981_multi_receiver": True,
            "royalties": [
                {
                    "receiver": "0x1111111",
                    "share": 1
                },
                {
                    "receiver": "0x2222222",
                    "share": 2
                }],
            "royalty_sum": 3,
            "is_collection_default": True,
            "payment_splitter_address": "mockedAddress"
        }

        with mock.patch('blockchainAPI.schema.resolve_royalties_token', return_value=resolve_royalties_token_return_value):
            result = self.client.execute('''
            query  {
                royaltyToken(chainId: 11155111, address: "0x1655e7FD801E9AA93e88Fa69f6D08D389AA8CD14", tokenId:0) {
                    hasPaymentSplitter
                    isCollectionDefault
                    royalties {
                        receiver
                        share
                    }
                    royaltySum
                    supportsErc2981
                    supportsErc2981MultiReceiver
                }
            }
            ''')

            expected_result = {
                "data": {
                    "royaltyToken": {
                        "hasPaymentSplitter": True,
                        "isCollectionDefault": True,
                        "royalties": [
                            {
                                "receiver": "0x1111111",
                                "share": 1.0
                            },
                            {
                                "receiver": "0x2222222",
                                "share": 2.0
                            }
                        ],
                        "royaltySum": 3.0,
                        "supportsErc2981": True,
                        "supportsErc2981MultiReceiver": True
                    }
                }
            }

            self.assertEqual(result, expected_result)


class WithdrawRoyaltyTokenTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_royalty_ctoken(self):
        resolve_royalties_token_return_value = {
            "supported_interface_erc2981": True,
            "supported_interface_erc2981_multi_receiver": True,
            "royalties": [
                {
                    "receiver": "0xAAAAA",
                    "share": 3
                },
            ],
            "royalty_sum": 3,
            "is_collection_default": True,
            "payment_splitter_address": "mockedAddress"
        }

        get_payment_splitter_royalties_return_value = [
            {
                "receiver": "0x1111111",
                "amount": 1
            },
            {
                "receiver": "0x2222222",
                "amount": 2
            }
        ]

        with mock.patch('blockchainAPI.schema.resolve_royalties_token', return_value=resolve_royalties_token_return_value), \
                mock.patch('blockchainAPI.schema.get_payment_splitter_royalties', return_value=get_payment_splitter_royalties_return_value):
            result = self.client.execute('''
            query {
            withdrawRoyaltyToken(chainId: 11155111, address: "0xAEb50E72A5B98BE0A7268f1A7c322e75276Aec3F", tokenId:0) {
                paymentSplitterAddress
                receivers {
                receiver
                amount
                }
            }
            }
            ''')

            expected_result = {
                "data": {
                    "withdrawRoyaltyToken": {
                        "paymentSplitterAddress": "mockedAddress",
                        "receivers": [
                            {
                                "receiver": "0x1111111",
                                "amount": 1.0
                            },
                            {
                                "receiver": "0x2222222",
                                "amount": 2.0
                            }
                        ]
                    }
                }
            }

            self.assertEqual(result, expected_result)


class CollectionOwnerTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_collection_owner(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.owner().call.return_value = "OwnerAddress"
        w3.eth.contract.return_value = contract

        with mock.patch('blockchainAPI.schema.blockchainProvider', return_value=w3):
            result = self.client.execute('''
            query  {
                collectionOwner(chainId: 11155111, address: "0x1655e7FD801E9AA93e88Fa69f6D08D389AA8CD14")
                }
            ''')

            expected_result = {
                "data": {
                    "collectionOwner": "OwnerAddress"
                }
            }

            self.assertEqual(result, expected_result)


class contractOwnedCreatedWithShopychangeTestCase(SimpleTestCase):
    def setUp(self):
        self.client = Client(schema)

    def test_resolve_contract_owned(self):
        mock_response_data_blockchain = ["0x6E11f15b909f6e22801DF6e7742a21cD578D946E",
                                         "0x94a6328c68c071ad2eEc397153DCDcA8F17ef339", "0xDB090F35Ced52D2f08e623856aDabae0ba7766C9"]

        w3 = mock.MagicMock()
        w3.eth.contract.return_value = mock.MagicMock()
        w3.eth.contract().functions.getAllERC721s(
        ).call.return_value = mock_response_data_blockchain

        first_address_owner_response_value = "0xABCDEFGH909f6e22801DF6e7742a21cD57812345"
        first_address_name_response_value = "Technological Animals"
        first_address_symbol_response_value = "TEA"

        second_address_owner_response_value = "0xABCDEFGH909f6e22801DF6e7742a21cD57812345"
        second_address_name_response_value = "Planet"
        second_address_symbol_response_value = "PLT"

        third_address_owner_response_value = "0xXXXXXEFGH909f6e22801DF6e7742a21cD578XXXX"

        with mock.patch('blockchainAPI.schema.blockchainProvider', return_value=w3):

            w3.eth.contract().functions.owner().call.side_effect = [
                first_address_owner_response_value,
                second_address_owner_response_value,
                third_address_owner_response_value
            ]

            w3.eth.contract().functions.name().call.side_effect = [
                first_address_name_response_value,
                second_address_name_response_value,
            ]

            w3.eth.contract().functions.symbol().call.side_effect = [
                first_address_symbol_response_value,
                second_address_symbol_response_value,
            ]

            result = self.client.execute('''
                query {
                    contractOwnedCreatedWithShopychange(chainId: 11155111, address: "0xABCDEFGH909f6e22801DF6e7742a21cD57812345") {
                        address
                        name
                        symbol
                    }
                }
            ''')

            expected_result = {
                'data': {
                    'contractOwnedCreatedWithShopychange': [
                        {
                            'address': '0x6E11f15b909f6e22801DF6e7742a21cD578D946E',
                            'name': 'Technological Animals',
                            'symbol': 'TEA'
                        },
                        {
                            'address': '0x94a6328c68c071ad2eEc397153DCDcA8F17ef339',
                            'name': 'Planet',
                            'symbol': 'PLT'
                        },
                    ]
                }
            }

            self.assertEqual(result, expected_result)
