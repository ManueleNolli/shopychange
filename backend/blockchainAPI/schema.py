from databaseAPI.models import NFTCollection, GeneralCollection
from backend.settings import boilerplateErc721ABI, marketplaceABI, erc2981MultiReceiverABI, factoryERC721ABI
import graphene
from graphene_django import DjangoObjectType
from web3 import Web3
import requests
from eth_utils import to_checksum_address

from graphql_types.types import NFT, NFTComplete, Collection, Contract, EventType, EventTransfer, EventApproval, EventApprovalForAll, EventMint, EventBurn, EventSaleCreated, EventSalePriceModified, EventSaleCancelled, EventSaleBought, Event, ShopychangeRoyaltyCollection, ShopychangeRoyaltyToken, WithdrawPaymentSplitterInfo
from utilities.resolveNFT import resolve_NFT
from utilities.resolveContract import resolve_contract
from utilities.resolveRoyalties import resolve_royalties_token, resolve_royalties_collection, get_payment_splitter_royalties
from utilities.formatIpfsURI import format_IPFS_URI
from utilities.blockchainProvider import blockchainProvider
from utilities.contractsAddress import marketplaceAddress, factoryERC721Address

ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
ERC721_INTERFACE_ID = '0x80ac58cd'
ERC1155_INTERFACE_ID = '0xd9b67a26'

#########
# Query #
#########


class Query(graphene.ObjectType):
    owned_nfts = graphene.List(
        NFT,
        args={
            'chainId': graphene.Argument(graphene.Int, required=True),
            'address': graphene.Argument(graphene.String, required=True)
        }
    )
    nft_complete = graphene.Field(
        NFTComplete,
        args={
            'chainId': graphene.Argument(graphene.Int, required=True),
            'address': graphene.Argument(graphene.String, required=True),
            'token_id': graphene.Argument(graphene.Int, required=True)}
    )
    collection = graphene.Field(
        Collection,
        args={
            'chainId': graphene.Argument(graphene.Int, required=True),
            'address': graphene.Argument(graphene.String, required=True)
        }
    )
    contract = graphene.Field(
        Contract,
        args={
            'chainId': graphene.Argument(graphene.Int, required=True),
            'address': graphene.Argument(graphene.String, required=True)
        }
    )
    nft_history = graphene.List(
        Event,
        args={
            'chainId': graphene.Argument(graphene.Int, required=True),
            'address': graphene.Argument(graphene.String, required=True),
            'token_id': graphene.Argument(graphene.Int, required=True)
        }
    )
    royalty_collection = graphene.Field(ShopychangeRoyaltyCollection, args={
        'chainId': graphene.Argument(graphene.Int, required=True),
        'address': graphene.Argument(graphene.String, required=True)
    })
    royalty_token = graphene.Field(ShopychangeRoyaltyToken, args={
        'chainId': graphene.Argument(graphene.Int, required=True),
        'address': graphene.Argument(graphene.String, required=True),
        'token_id': graphene.Argument(graphene.Int, required=True)
    })
    withdraw_royalty_collection = graphene.Field(WithdrawPaymentSplitterInfo, args={
        'chainId': graphene.Argument(graphene.Int, required=True),
        'address': graphene.Argument(graphene.String, required=True)
    })
    withdraw_royalty_token = graphene.Field(WithdrawPaymentSplitterInfo, args={
        'chainId': graphene.Argument(graphene.Int, required=True),
        'address': graphene.Argument(graphene.String, required=True),
        'token_id': graphene.Argument(graphene.Int, required=True)
    })
    collection_owner = graphene.String(args={
        'chainId': graphene.Argument(graphene.Int, required=True),
        'address': graphene.Argument(graphene.String, required=True)})
    contract_owned_created_with_shopychange = graphene.Field(
        graphene.List(Contract),
        args={
            'chainId': graphene.Argument(graphene.Int, required=True),
            'address': graphene.Argument(graphene.String, required=True)
        }
    )

    def resolve_owned_nfts(self, info, chainId, address):
        w3 = blockchainProvider(chainId)

        contracts = NFTCollection.objects.filter(
            user=address).values_list('collection_address', flat=True)
        general_collections = GeneralCollection.objects.all().values_list(
            'collection_address', flat=True)

        # add general collections to contracts
        contracts = set(list(contracts) +
                        list(general_collections))

        owned_nfts = []
        for contract in contracts:
            contract_address = to_checksum_address(contract)
            contract = w3.eth.contract(
                address=contract_address, abi=boilerplateErc721ABI)

            sent_events = contract.events.Transfer.get_logs(
                fromBlock=0,
                toBlock='latest',
                argument_filters={'from': address}
            )

            received_events = contract.events.Transfer.get_logs(
                fromBlock=0,
                toBlock='latest',
                argument_filters={'to': address}
            )

            events = sent_events + received_events

            unique_events = []

            # Iterate through the events and add them to the list if not already present
            for event in events:
                if event not in unique_events:
                    unique_events.append(event)

            events = unique_events

            # sort events by block number and transaction index
            events.sort(key=lambda x: (
                x['blockNumber'], x['transactionIndex']))

            for event in events:
                fromAddress = event['args']['from']
                toAddress = event['args']['to']
                tokenId = event['args']['tokenId']

                if toAddress == address:
                    owned_nfts.append({
                        'contract_address': contract_address,
                        'token_id': tokenId
                    })
                elif fromAddress == address:
                    owned_nfts.remove({
                        'contract_address': contract_address,
                        'token_id': tokenId
                    })

        for nft in owned_nfts:
            nft_data = resolve_NFT(
                w3, nft['contract_address'], nft['token_id'])
            nft['image'] = nft_data.image
            nft['name'] = nft_data.name

        return owned_nfts

    def resolve_nft_complete(self, info, chainId,  address, token_id):
        w3 = blockchainProvider(chainId)

        contract = w3.eth.contract(
            address=address, abi=boilerplateErc721ABI)
        tokenURI = contract.functions.tokenURI(token_id).call()

        # read metadata from IPFS
        tokenURI = format_IPFS_URI(tokenURI)

        metadata = requests.get(tokenURI).json()
        image = format_IPFS_URI(metadata.get('image', ''))
        name = metadata.get('name', '')
        description = metadata.get('description', '')
        attributes = metadata.get('attributes', [])

        support_interface_erc721 = contract.functions.supportsInterface(
            ERC721_INTERFACE_ID).call()
        support_interface_erc1155 = contract.functions.supportsInterface(
            ERC1155_INTERFACE_ID).call()

        token_type = ''
        if support_interface_erc721:
            token_type = 'ERC721'
        elif support_interface_erc1155:
            token_type = 'ERC1155'

        owner = contract.functions.ownerOf(token_id).call()
        owner = to_checksum_address(owner)

        contract_data = resolve_contract(w3, address)

        return NFTComplete(
            nft=NFT(
                contract_address=address,
                token_id=token_id,
                image=image,
                name=name
            ),
            owner=owner,
            description=description,
            attributes=attributes,
            contract=contract_data,
            token_type=token_type
        )

    def resolve_collection(self, info, chainId,  address):
        w3 = blockchainProvider(chainId)

        contract = w3.eth.contract(
            address=address, abi=boilerplateErc721ABI)
        mint_events = contract.events.Transfer.get_logs(
            fromBlock=0,
            toBlock='latest',
            argument_filters={'from': ZERO_ADDRESS}
        )

        burn_events = contract.events.Transfer.get_logs(
            fromBlock=0,
            toBlock='latest',
            argument_filters={'to': ZERO_ADDRESS}
        )

        events = mint_events + burn_events
        unique_events = []

        # Iterate through the events and add them to the list if not already present
        for event in events:
            if event not in unique_events:
                unique_events.append(event)

        events = unique_events

        # sort events by block number and transaction index
        events.sort(key=lambda x: (
            x['blockNumber'], x['transactionIndex']))

        nfts = []
        for event in events:
            fromAddress = event['args']['from']
            toAddress = event['args']['to']
            tokenId = event['args']['tokenId']

            if toAddress == ZERO_ADDRESS:
                nfts.remove({
                    'contract_address': address,
                    'token_id': tokenId
                })
            elif fromAddress == ZERO_ADDRESS:
                nfts.append({
                    'contract_address': address,
                    'token_id': tokenId
                })

        for nft in nfts:
            nft_data = resolve_NFT(
                w3, nft['contract_address'], nft['token_id'])
            nft['image'] = nft_data.image
            nft['name'] = nft_data.name

        contract_info = resolve_contract(w3, address)

        return Collection(
            contract=contract_info,
            nfts=nfts
        )

    def resolve_contract(self, info, chainId,  address):
        w3 = blockchainProvider(chainId)
        return resolve_contract(w3, address)

    def resolve_nft_history(self, info, chainId,  address, token_id):
        w3 = blockchainProvider(chainId)

        ###################################################
        # Get events from token contract / ERC721-ERC1155 #
        ###################################################

        contractToken = w3.eth.contract(
            address=address,
            abi=boilerplateErc721ABI
        )

        events_transfer = contractToken.events.Transfer.get_logs(
            fromBlock=0,
            toBlock='latest',
            argument_filters={'tokenId': token_id}
        )

        events_approval = contractToken.events.Approval.get_logs(
            fromBlock=0,
            toBlock='latest',
            argument_filters={'tokenId': token_id,
                              'approved': marketplaceAddress(chainId)}
        )

        events_approval_for_all = contractToken.events.ApprovalForAll.get_logs(
            fromBlock=0,
            toBlock='latest',
            argument_filters={'tokenId': token_id,
                              'operator': marketplaceAddress(chainId)}
        )

        ###############################
        # Get events from marketpalce #
        ###############################

        contractMarketplace = w3.eth.contract(
            address=marketplaceAddress(chainId),
            abi=marketplaceABI
        )

        events_sale_created = contractMarketplace.events.SaleCreated.get_logs(
            fromBlock=0,
            toBlock='latest',
            argument_filters={'tokenId': token_id, 'contractAddress': address}
        )

        events_sale_bought = contractMarketplace.events.SaleBought.get_logs(
            fromBlock=0,
            toBlock='latest',
            argument_filters={'tokenId': token_id, 'contractAddress': address}
        )

        events_sale_cancelled = contractMarketplace.events.SaleCancelled.get_logs(
            fromBlock=0,
            toBlock='latest',
            argument_filters={'tokenId': token_id, 'contractAddress': address}
        )

        events_sale_modified = contractMarketplace.events.SalePriceModified.get_logs(
            fromBlock=0,
            toBlock='latest',
            argument_filters={'tokenId': token_id, 'contractAddress': address}
        )

        events = events_transfer + events_approval + events_approval_for_all + events_sale_created + events_sale_bought + \
            events_sale_cancelled + events_sale_modified

        ################
        # SOLVE EVENTS #
        ################

        events_objects = []

        for event in events:
            event_type = event['event']
            block_number = event['blockNumber']
            date = w3.eth.get_block(block_number)['timestamp']

            match event_type:

                case EventType.Transfer.value:

                    from_address = event['args']['from']
                    to_address = event['args']['to']

                    if from_address == ZERO_ADDRESS:

                        events_objects.append(EventMint(
                            date=date,
                            to_address=to_address,
                        ))

                    elif to_address == ZERO_ADDRESS:

                        events_objects.append(EventBurn(
                            date=date,
                            from_address=from_address,
                        ))

                    else:
                        events_objects.append(EventTransfer(
                            date=date,
                            from_address=from_address,
                            to_address=to_address
                        ))

                case EventType.Approval.value:

                    owner = event['args']['owner']
                    approved = event['args']['approved']

                    events_objects.append(EventApproval(
                        date=date,
                        owner=owner,
                        approved=approved
                    ))

                case EventType.ApprovalForAll.value:

                    owner = event['args']['owner']
                    operator = event['args']['operator']
                    approved = event['args']['approved']

                    events_objects.append(EventApprovalForAll(
                        date=date,
                        owner=owner,
                        operator=operator,
                        is_approved=approved
                    ))

                case EventType.SaleCreated.value:

                    seller = event['args']['seller']
                    price = event['args']['price']

                    # convert to eth
                    price = Web3.from_wei(price, 'ether')

                    events_objects.append(EventSaleCreated(
                        date=date,
                        seller=seller,
                        price=price
                    ))

                case EventType.SaleBought.value:

                    buyer = event['args']['buyer']
                    price = event['args']['price']
                    seller = event['args']['seller']

                    # convert to eth
                    price = Web3.from_wei(price, 'ether')

                    events_objects.append(EventSaleBought(
                        date=date,
                        buyer=buyer,
                        seller=seller,
                        price=price
                    ))

                case EventType.SaleCancelled.value:

                    seller = event['args']['seller']

                    events_objects.append(EventSaleCancelled(
                        date=date,
                        seller=seller
                    ))

                case EventType.SalePriceModified.value:

                    seller = event['args']['seller']
                    price = event['args']['price']
                    previous_price = event['args']['previousPrice']

                    # convert to eth
                    price = Web3.from_wei(price, 'ether')
                    previous_price = Web3.from_wei(previous_price, 'ether')

                    events_objects.append(EventSalePriceModified(
                        date=date,
                        seller=seller,
                        previous_price=previous_price,
                        price=price
                    ))

                case _:
                    pass

        return events_objects

    def resolve_royalty_collection(self, info, chainId,  address):
        w3 = blockchainProvider(chainId)

        contract = w3.eth.contract(
            address=address, abi=erc2981MultiReceiverABI)

        contract_royalties = resolve_royalties_collection(w3, contract)
        return ShopychangeRoyaltyCollection(
            supports_erc2981_multi_receiver=contract_royalties[
                "supported_interface_erc2981_multi_receiver"],
            supports_erc2981=contract_royalties["supported_interface_erc2981"],
            royalties=contract_royalties["royalties"],
            royalty_sum=contract_royalties["royalty_sum"],
            has_payment_splitter=True if contract_royalties["payment_splitter_address"] else False,
        )

    def resolve_withdraw_royalty_collection(self, info, chainId,  address):
        w3 = blockchainProvider(chainId)

        contract = w3.eth.contract(
            address=address, abi=erc2981MultiReceiverABI)

        contract_royalties = resolve_royalties_collection(w3, contract)
        withdraw_info = None
        if contract_royalties['payment_splitter_address']:
            withdraw_info = get_payment_splitter_royalties(
                w3, contract_royalties['payment_splitter_address'], contract_royalties['royalties'])

        return WithdrawPaymentSplitterInfo(
            receivers=withdraw_info,
            payment_splitter_address=contract_royalties['payment_splitter_address']
        )

    def resolve_royalty_token(self, info, chainId,  address, token_id):
        w3 = blockchainProvider(chainId)

        contract = w3.eth.contract(
            address=address, abi=erc2981MultiReceiverABI)

        contract_royalties = resolve_royalties_token(w3, contract, token_id)

        return ShopychangeRoyaltyToken(
            supports_erc2981_multi_receiver=contract_royalties[
                "supported_interface_erc2981_multi_receiver"],
            supports_erc2981=contract_royalties["supported_interface_erc2981"],
            royalties=contract_royalties["royalties"],
            royalty_sum=contract_royalties["royalty_sum"],
            is_collection_default=contract_royalties["is_collection_default"],
            has_payment_splitter=True if contract_royalties["payment_splitter_address"] else False,
        )

    def resolve_withdraw_royalty_token(self, info, chainId,  address, token_id):
        w3 = blockchainProvider(chainId)

        contract = w3.eth.contract(
            address=address, abi=erc2981MultiReceiverABI)

        contract_royalties = resolve_royalties_token(w3, contract, token_id)
        withdraw_info = None
        if contract_royalties['payment_splitter_address']:
            withdraw_info = get_payment_splitter_royalties(
                w3, contract_royalties['payment_splitter_address'], contract_royalties['royalties'])

        return WithdrawPaymentSplitterInfo(
            receivers=withdraw_info,
            payment_splitter_address=contract_royalties['payment_splitter_address']
        )

    def resolve_collection_owner(self, info, chainId,  address):
        w3 = blockchainProvider(chainId)

        contract = w3.eth.contract(
            address=address, abi=boilerplateErc721ABI)

        owner = contract.functions.owner().call()

        return owner

    def resolve_contract_owned_created_with_shopychange(self, info, chainId,  address):
        w3 = blockchainProvider(chainId)

        factory = w3.eth.contract(
            address=factoryERC721Address(chainId), abi=factoryERC721ABI)

        contracts = factory.functions.getAllERC721s().call()

        contract_objects = []

        for contract_owned in contracts:
            contract = w3.eth.contract(
                address=contract_owned, abi=boilerplateErc721ABI)

            owner = contract.functions.owner().call()

            if owner != address:
                continue

            name = contract.functions.name().call()
            symbol = contract.functions.symbol().call()

            contract_object = Contract(
                address=contract_owned,
                name=name,
                symbol=symbol
            )

            contract_objects.append(contract_object)

        return contract_objects


schema = graphene.Schema(query=Query)
