from backend.settings import ERC2981_MULTI_RECEIVER_ID, ERC2981_ID, paymentSplitterABI
from graphql_types.types import Royalty, WithdrawReceiverInfo
from web3 import Web3


def get_token_royalties(w3, contract, token_id, fetched_royalty):
    payment_splitter = contract.functions.hasPaymentSplitter(
        token_id).call()
    royalties = []
    if payment_splitter:
        payment_splitter_contract = w3.eth.contract(
            address=fetched_royalty[0], abi=paymentSplitterABI)
        receivers = payment_splitter_contract.functions.getReceivers().call()
        royalty_sum = 0
        for receiver in receivers:
            if receiver[1] != 0:
                royalties.append(Royalty(
                    receiver=receiver[0],
                    share=receiver[1]/100
                ))
                royalty_sum += receiver[1]/100
    else:
        if fetched_royalty[1] != 0:
            royalties.append(Royalty(
                receiver=fetched_royalty[0],
                share=fetched_royalty[1]/100
            ))
            royalty_sum = fetched_royalty[1]/100

    return {
        'royalties': royalties,
        'royalty_sum': royalty_sum,
        'payment_splitter_address': fetched_royalty[0] if payment_splitter else None
    }


def get_collection_royalties(w3, contract, fetched_royalty):
    payment_splitter = contract.functions.hasDefaultPaymentSplitter().call()
    royalties = []
    royalty_sum = 0
    if payment_splitter:
        payment_splitter_contract = w3.eth.contract(
            address=fetched_royalty[0], abi=paymentSplitterABI)
        receivers = payment_splitter_contract.functions.getReceivers().call()
        for receiver in receivers:
            if receiver[1] != 0:
                royalties.append(Royalty(
                    receiver=receiver[0],
                    share=receiver[1]/100
                ))
                royalty_sum += receiver[1]/100
    else:
        if fetched_royalty[1] != 0:
            royalties.append(Royalty(
                receiver=fetched_royalty[0],
                share=fetched_royalty[1]/100
            ))
            royalty_sum = fetched_royalty[1]/100

    return {
        'royalties': royalties,
        'royalty_sum': royalty_sum,
        'payment_splitter_address': fetched_royalty[0] if payment_splitter else None
    }


def get_payment_splitter_royalties(w3, address, fetched_royalty):
    contract = w3.eth.contract(address=address, abi=paymentSplitterABI)
    withdraw_info = []

    for index in range(len(fetched_royalty)):
        value = contract.functions.releasable(index).call()
        withdraw_info.append(WithdrawReceiverInfo(
            receiver=fetched_royalty[index].receiver,
            amount=Web3.from_wei(value, 'ether')
        ))

    return withdraw_info


def check_support_royalties(contract):
    supported_interface_erc2981_multi_receiver = contract.functions.supportsInterface(
        ERC2981_MULTI_RECEIVER_ID).call()
    supported_interface_erc2981 = contract.functions.supportsInterface(
        ERC2981_ID).call()

    return {
        'supported_interface_erc2981_multi_receiver': supported_interface_erc2981_multi_receiver,
        'supported_interface_erc2981': supported_interface_erc2981
    }


def resolve_royalties_collection(w3, contract):
    support = check_support_royalties(contract)
    if not support['supported_interface_erc2981']:
        return {
            'supported_interface_erc2981_multi_receiver': support['supported_interface_erc2981_multi_receiver'],
            'supported_interface_erc2981': support['supported_interface_erc2981'],
            'royalties': [],
            'royalty_sum': 0,
            'payment_splitter_address': None
        }

    royalty = contract.functions.royaltyInfo(999999, 10000).call()
    if not support['supported_interface_erc2981_multi_receiver']:
        royalties = []
        royalty_sum = 0
        if royalty[1] != 0:
            royalties.append(Royalty(
                receiver=royalty[0],
                share=royalty[1]/100
            ))
            royalty_sum = royalty[1]/100
        return {
            'supported_interface_erc2981_multi_receiver': support['supported_interface_erc2981_multi_receiver'],
            'supported_interface_erc2981': support['supported_interface_erc2981'],
            'royalties': royalties,
            'royalty_sum': royalty_sum,
            'payment_splitter_address': None
        }

    collectionRoyalties = get_collection_royalties(w3, contract, royalty)
    return {
        'supported_interface_erc2981_multi_receiver': support['supported_interface_erc2981_multi_receiver'],
        'supported_interface_erc2981': support['supported_interface_erc2981'],
        'royalties': collectionRoyalties['royalties'],
        'royalty_sum': collectionRoyalties['royalty_sum'],
        'payment_splitter_address': collectionRoyalties['payment_splitter_address']
    }


def resolve_royalties_token(w3, contract, token_id):
    support = check_support_royalties(contract)
    if not support['supported_interface_erc2981']:
        return {
            'supported_interface_erc2981_multi_receiver': support['supported_interface_erc2981_multi_receiver'],
            'supported_interface_erc2981': support['supported_interface_erc2981'],
            'royalties': [],
            'royalty_sum': 0,
            'is_collection_default': None,
            'payment_splitter_address': None
        }

    royalty = contract.functions.royaltyInfo(token_id, 10000).call()

    if not support['supported_interface_erc2981_multi_receiver']:
        royalties = []
        royalty_sum = 0
        if royalty[1] != 0:
            royalties.append(Royalty(
                receiver=royalty[0],
                share=royalty[1]/100
            ))
            royalty_sum = royalty[1]/100
        return {
            'supported_interface_erc2981_multi_receiver': support['supported_interface_erc2981_multi_receiver'],
            'supported_interface_erc2981': support['supported_interface_erc2981'],
            'royalties': royalties,
            'royalty_sum': royalty_sum,
            'is_collection_default': None,
            'payment_splitter_address': None
        }

    hasTokenPersonalizedRoyalties = contract.functions.hasPersonalizedRoyalties(
        token_id).call()
    royalty_sum = 0
    royalties = []
    payment_splitter_address = None
    if hasTokenPersonalizedRoyalties:
        tokenRoyalties = get_token_royalties(w3, contract, token_id, royalty)
        royalties = tokenRoyalties['royalties']
        royalty_sum = tokenRoyalties['royalty_sum']
        payment_splitter_address = tokenRoyalties['payment_splitter_address']
    else:
        collectionRoyalties = get_collection_royalties(w3, contract, royalty)
        royalties = collectionRoyalties['royalties']
        royalty_sum = collectionRoyalties['royalty_sum']
        payment_splitter_address = collectionRoyalties['payment_splitter_address']

    return {
        'supported_interface_erc2981_multi_receiver': support['supported_interface_erc2981_multi_receiver'],
        'supported_interface_erc2981': support['supported_interface_erc2981'],
        'royalties': royalties,
        'royalty_sum': royalty_sum,
        'is_collection_default': not hasTokenPersonalizedRoyalties,
        'payment_splitter_address': payment_splitter_address
    }
