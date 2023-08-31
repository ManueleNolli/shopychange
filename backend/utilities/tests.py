import unittest
from unittest import mock
from graphql_types.types import Royalty

from utilities.resolveNFT import resolve_NFT
from utilities.resolveRoyalties import get_token_royalties, get_collection_royalties, get_payment_splitter_royalties, check_support_royalties, resolve_royalties_collection, resolve_royalties_token
from utilities.blockchainProvider import blockchainProvider
from utilities.contractsAddress import marketplaceAddress, factoryERC721Address

from backend.settings import LOCAL_CHAIN_ID, SEPOLIA_CHAIN_ID,  SEPOLIA_MARKETPLACE_ADDRESS, LOCAL_MARKETPLACE_ADDRESS, SEPOLIA_SHOPYCHANGE_ERC721_FACTORY_ADDRESS, LOCAL_SHOPYCHANGE_ERC721_FACTORY_ADDRESS


class TestResolveNFT(unittest.TestCase):
    def test_resolve_NFT(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.tokenURI().call.return_value = "tokenURI"

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

        with mock.patch('utilities.resolveNFT.requests', requests):
            result = resolve_NFT(w3, 'address', 5)

        self.assertEqual(result.name, 'NFT 1')
        self.assertEqual(result.image, 'https://ipfs.io/ipfs/image1')
        self.assertEqual(result.contract_address, 'address')
        self.assertEqual(result.token_id, 5)


class TestResolveRoyalties(unittest.TestCase):
    def test_check_support_royalties(self):
        contract = mock.MagicMock()
        contract.functions.supportsInterface().call.side_effect = [True, True]

        result = check_support_royalties(contract)

        self.assertEqual(result['supported_interface_erc2981'], True)
        self.assertEqual(
            result['supported_interface_erc2981_multi_receiver'], True)


class TestGetCollectionRoyalties(unittest.TestCase):
    def test_get_collection_royalties_no_payment_splitter(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.hasDefaultPaymentSplitter().call.return_value = False

        result = get_collection_royalties(w3, contract, ['receiver', 1000])

        self.assertEqual(result['royalties'][0].receiver, 'receiver')
        self.assertEqual(result['royalties'][0].share, 10)
        self.assertEqual(result['royalty_sum'], 10)
        self.assertEqual(result['payment_splitter_address'], None)

    def test_get_collection_royalties_with_payment_splitter(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.hasDefaultPaymentSplitter().call.return_value = True

        paymentSplitterContract = mock.MagicMock()
        paymentSplitterContract.functions.getReceivers().call.return_value = [
            ['receiver1', 100], ['receiver2', 200]
        ]

        w3.eth.contract.return_value = paymentSplitterContract

        result = get_collection_royalties(
            w3, contract, ['paymentSplitter', 300])

        self.assertEqual(result['royalties'][0].receiver, 'receiver1')
        self.assertEqual(result['royalties'][0].share, 1)
        self.assertEqual(result['royalties'][1].receiver, 'receiver2')
        self.assertEqual(result['royalties'][1].share, 2)
        self.assertEqual(result['royalty_sum'], 3)
        self.assertEqual(result['payment_splitter_address'], 'paymentSplitter')


class TestGetTokenRoyalties(unittest.TestCase):
    def test_get_token_royalties_no_payment_splitter(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.hasPaymentSplitter().call.return_value = False

        result = get_token_royalties(w3, contract, 1, ['receiver', 1000])

        self.assertEqual(result['royalties'][0].receiver, 'receiver')
        self.assertEqual(result['royalties'][0].share, 10)
        self.assertEqual(result['royalty_sum'], 10)
        self.assertEqual(result['payment_splitter_address'], None)

    def test_get_token_royalties_with_payment_splitter(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.hasPaymentSplitter().call.return_value = True

        paymentSplitterContract = mock.MagicMock()
        paymentSplitterContract.functions.getReceivers().call.return_value = [
            ['receiver1', 100], ['receiver2', 200]
        ]

        w3.eth.contract.return_value = paymentSplitterContract

        result = get_token_royalties(
            w3, contract, 1, ['paymentSplitter', 300])

        self.assertEqual(result['royalties'][0].receiver, 'receiver1')
        self.assertEqual(result['royalties'][0].share, 1)
        self.assertEqual(result['royalties'][1].receiver, 'receiver2')
        self.assertEqual(result['royalties'][1].share, 2)
        self.assertEqual(result['royalty_sum'], 3)
        self.assertEqual(result['payment_splitter_address'], 'paymentSplitter')


class TestPaymentSplitterRoyalties(unittest.TestCase):
    def test_get_payment_splitter_royalties(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()

        def releasable(*args, **kwargs):
            returnFunc = mock.MagicMock()
            returnFunc.call.return_value = 100 * args[0]
            return returnFunc

        contract.functions.releasable().side_effect = releasable
        w3.eth.contract.return_value = contract

        # mock Web3.from_wei
        with mock.patch('utilities.resolveRoyalties.Web3.from_wei', return_value='100'):

            result = get_payment_splitter_royalties(
                w3, "mockedAddress", [Royalty(receiver='0xdc113717164435aD887EB5D3b39Ffc549573ebc8', share=5.0), Royalty(receiver='0x963E5DbBcaeEA4c00bab65DdDce727EFd995DEa8', share=1.0)])

            self.assertEqual(
                result[0].receiver, '0xdc113717164435aD887EB5D3b39Ffc549573ebc8')
            self.assertEqual(result[0].amount, '100')
            self.assertEqual(
                result[1].receiver, '0x963E5DbBcaeEA4c00bab65DdDce727EFd995DEa8')
            self.assertEqual(result[1].amount, '100')


class TestResolveRoyaltiesCollection(unittest.TestCase):
    def test_resolve_royalties_collection_no_support_erc2981(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()

        check_support_royalties_return_value = {
            "supported_interface_erc2981": False,
            "supported_interface_erc2981_multi_receiver": False
        }

        with mock.patch('utilities.resolveRoyalties.check_support_royalties', return_value=check_support_royalties_return_value):
            result = resolve_royalties_collection(w3, contract)

            self.assertEqual(
                result,
                {
                    "supported_interface_erc2981": False,
                    "supported_interface_erc2981_multi_receiver": False,
                    "royalties": [],
                    "royalty_sum": 0,
                    "payment_splitter_address": None
                }
            )

    def test_resolve_royalties_collection_with_support_erc2981_no_erc2981_multi_receiver(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.royaltyInfo().call.return_value = ['receiver', 100]

        check_support_royalties_return_value = {
            "supported_interface_erc2981": True,
            "supported_interface_erc2981_multi_receiver": False
        }

        with mock.patch('utilities.resolveRoyalties.check_support_royalties', return_value=check_support_royalties_return_value):
            result = resolve_royalties_collection(w3, contract)

            self.assertEqual(
                result,
                {
                    "supported_interface_erc2981": True,
                    "supported_interface_erc2981_multi_receiver": False,
                    "royalties": [Royalty(receiver="receiver", share=1.0)],
                    "royalty_sum": 1,
                    "payment_splitter_address": None
                }
            )

    def test_resolve_royalties_collection_with_support_erc2981_and_erc2981_multi_receiver(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.royaltyInfo().call.return_value = ['receiver', 100]

        check_support_royalties_return_value = {
            "supported_interface_erc2981": True,
            "supported_interface_erc2981_multi_receiver": True
        }

        get_collection_royalties_return_value = {
            "royalties": [Royalty(receiver="receiver", share=1.0), Royalty(receiver="receiver2", share=2.0)],
            "royalty_sum": 3,
            "payment_splitter_address": "mockedAddress"
        }

        with mock.patch('utilities.resolveRoyalties.check_support_royalties', return_value=check_support_royalties_return_value), \
                mock.patch('utilities.resolveRoyalties.get_collection_royalties', return_value=get_collection_royalties_return_value):
            result = resolve_royalties_collection(w3, contract)

            self.assertEqual(
                result,
                {
                    "supported_interface_erc2981": True,
                    "supported_interface_erc2981_multi_receiver": True,
                    "royalties": [Royalty(receiver="receiver", share=1.0), Royalty(receiver="receiver2", share=2.0)],
                    "royalty_sum": 3,
                    "payment_splitter_address": "mockedAddress"
                }
            )


class TestResolveRoyaltiesToken(unittest.TestCase):
    def test_resolve_royalties_token_no_support_erc2981(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()

        check_support_royalties_return_value = {
            "supported_interface_erc2981": False,
            "supported_interface_erc2981_multi_receiver": False
        }

        with mock.patch('utilities.resolveRoyalties.check_support_royalties', return_value=check_support_royalties_return_value):
            result = resolve_royalties_token(w3, contract, 0)

            self.assertEqual(
                result,
                {
                    "supported_interface_erc2981": False,
                    "supported_interface_erc2981_multi_receiver": False,
                    "royalties": [],
                    "royalty_sum": 0,
                    "is_collection_default": None,
                    "payment_splitter_address": None
                }
            )

    def test_resolve_royalties_token_with_support_erc2981_no_erc2981_multi_receiver(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.royaltyInfo().call.return_value = ['receiver', 100]

        check_support_royalties_return_value = {
            "supported_interface_erc2981": True,
            "supported_interface_erc2981_multi_receiver": False
        }

        with mock.patch('utilities.resolveRoyalties.check_support_royalties', return_value=check_support_royalties_return_value):
            result = resolve_royalties_token(w3, contract, 0)
            self.assertEqual(
                result,
                {
                    "supported_interface_erc2981": True,
                    "supported_interface_erc2981_multi_receiver": False,
                    "royalties": [Royalty(receiver="receiver", share=1.0)],
                    "royalty_sum": 1.0,
                    "is_collection_default": None,
                    "payment_splitter_address": None
                }
            )

    def test_resolve_royalties_token_with_support_erc2981_and_erc2981_multi_receiver_no_personalized_royalties(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.royaltyInfo().call.return_value = ['receiver', 100]
        contract.functions.hasPersonalizedRoyalties().call.return_value = False
        check_support_royalties_return_value = {
            "supported_interface_erc2981": True,
            "supported_interface_erc2981_multi_receiver": True
        }

        get_collection_royalties_return_value = {
            "royalties": [Royalty(receiver="receiver", share=1.0), Royalty(receiver="receiver2", share=2.0)],
            "royalty_sum": 3,
            "payment_splitter_address": "mockedAddress"
        }

        with mock.patch('utilities.resolveRoyalties.check_support_royalties', return_value=check_support_royalties_return_value), \
                mock.patch('utilities.resolveRoyalties.get_collection_royalties', return_value=get_collection_royalties_return_value):
            result = resolve_royalties_token(w3, contract, 0)
            self.assertEqual(
                result,
                {
                    "supported_interface_erc2981": True,
                    "supported_interface_erc2981_multi_receiver": True,
                    "royalties": [Royalty(receiver="receiver", share=1.0), Royalty(receiver="receiver2", share=2.0)],
                    "royalty_sum": 3,
                    "is_collection_default": True,
                    "payment_splitter_address": "mockedAddress"
                }
            )

    def test_resolve_royalties_token_with_support_erc2981_and_erc2981_multi_receiver_and_personalized_royalties(self):
        w3 = mock.MagicMock()
        contract = mock.MagicMock()
        contract.functions.royaltyInfo().call.return_value = ['receiver', 100]
        contract.functions.hasPersonalizedRoyalties().call.return_value = True
        check_support_royalties_return_value = {
            "supported_interface_erc2981": True,
            "supported_interface_erc2981_multi_receiver": True
        }

        get_token_royalties_return_value = {
            "royalties": [Royalty(receiver="receiver", share=1.0), Royalty(receiver="receiver2", share=2.0)],
            "royalty_sum": 3,
            "payment_splitter_address": "mockedAddress"
        }

        with mock.patch('utilities.resolveRoyalties.check_support_royalties', return_value=check_support_royalties_return_value), \
                mock.patch('utilities.resolveRoyalties.get_token_royalties', return_value=get_token_royalties_return_value):
            result = resolve_royalties_token(w3, contract, 0)
            self.assertEqual(
                result,
                {
                    "supported_interface_erc2981": True,
                    "supported_interface_erc2981_multi_receiver": True,
                    "royalties": [Royalty(receiver="receiver", share=1.0), Royalty(receiver="receiver2", share=2.0)],
                    "royalty_sum": 3,
                    "is_collection_default": False,
                    "payment_splitter_address": "mockedAddress"
                }
            )


class TestBlockchainProvider(unittest.TestCase):
    def test_sepolia(self):
        result = blockchainProvider(int(SEPOLIA_CHAIN_ID))
        result = result.provider.endpoint_uri
        self.assertIn('eth-sepolia.g.alchemy.com', result)

    def test_local(self):
        result = blockchainProvider(int(LOCAL_CHAIN_ID))
        result = result.provider.endpoint_uri
        self.assertEqual(result, 'http://127.0.0.1:8545')

    def test_invalid_chain_id(self):
        with self.assertRaises(Exception):
            blockchainProvider(1)


class TestContractsAddress(unittest.TestCase):

    def test_marketplaceAddress_sepolia(self):
        result = marketplaceAddress(int(SEPOLIA_CHAIN_ID))
        self.assertEqual(result, SEPOLIA_MARKETPLACE_ADDRESS)

    def test_marketplaceAddress_local(self):
        result = marketplaceAddress(int(LOCAL_CHAIN_ID))
        self.assertEqual(result, LOCAL_MARKETPLACE_ADDRESS)

    def test_marketplaceAddress_invalid_chain_id(self):
        with self.assertRaises(Exception):
            marketplaceAddress(1)

    def test_factoryERC721Address_sepolia(self):
        result = factoryERC721Address(int(SEPOLIA_CHAIN_ID))
        self.assertEqual(result, SEPOLIA_SHOPYCHANGE_ERC721_FACTORY_ADDRESS)

    def test_factoryERC721Address_local(self):
        result = factoryERC721Address(int(LOCAL_CHAIN_ID))
        self.assertEqual(result, LOCAL_SHOPYCHANGE_ERC721_FACTORY_ADDRESS)

    def test_factoryERC721Address_invalid_chain_id(self):
        with self.assertRaises(Exception):
            factoryERC721Address(1)
