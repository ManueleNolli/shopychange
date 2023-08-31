from backend.settings import marketplaceABI, boilerplateErc721ABI
import graphene
from graphene_django import DjangoObjectType
from web3 import Web3
import requests
from eth_utils import to_checksum_address

from graphql_types.SaleStatus import SaleStatus
from graphql_types.types import Sale, NFT
from utilities.resolveNFT import resolve_NFT
from utilities.formatIpfsURI import format_IPFS_URI
from utilities.blockchainProvider import blockchainProvider
from utilities.contractsAddress import marketplaceAddress, factoryERC721Address

#########
# Query #
#########


class Query(graphene.ObjectType):
    sales = graphene.List(NFT, args={
        'chainId': graphene.Argument(graphene.Int, required=True)
    })
    sale = graphene.Field(
        Sale, args={
            'chainId': graphene.Argument(graphene.Int, required=True),
            'address': graphene.Argument(graphene.String, required=True),
            'token_id': graphene.Argument(graphene.Int, required=True)})
    is_marketplace_approved = graphene.Boolean(args={
        'chainId': graphene.Argument(graphene.Int, required=True),
        'address': graphene.Argument(graphene.String, required=True),
        'token_id': graphene.Argument(graphene.Int, required=True)})
    is_token_for_sale = graphene.Boolean(args={
        'chainId': graphene.Argument(graphene.Int, required=True),
        'address': graphene.Argument(graphene.String, required=True),
        'token_id': graphene.Argument(graphene.Int, required=True)})
    is_admin = graphene.Boolean(args={
        'chainId': graphene.Argument(graphene.Int, required=True),
        'address': graphene.Argument(graphene.String, required=True)})
    marketplace_royalty = graphene.Float(args={
        'chainId': graphene.Argument(graphene.Int, required=True)
    })
    marketplace_balance = graphene.Float(args={
        'chainId': graphene.Argument(graphene.Int, required=True)
    })

    def resolve_sales(self, info, chainId):
        w3 = blockchainProvider(chainId)

        marketplace = w3.eth.contract(
            address=marketplaceAddress(chainId), abi=marketplaceABI)

        sales = marketplace.functions.getSales().call()
        sales_objects = []

        for sale in sales:
            nftContract = sale[0]
            tokenId = sale[2]
            status = sale[4]

            # Status = 2 means that the sale is active
            if status != SaleStatus.LISTED.value:
                continue

            nft = resolve_NFT(w3, nftContract, tokenId)
            sales_objects.append(nft)

        return sales_objects

    def resolve_sale(self, info, chainId, address, token_id):
        w3 = blockchainProvider(chainId)

        marketplace = w3.eth.contract(
            address=marketplaceAddress(chainId), abi=marketplaceABI)

        sale = marketplace.functions.getSale(address, token_id).call()

        # If seller is 0x0, then the sale does not exist
        if (sale[1] == '0x0000000000000000000000000000000000000000'):
            return None

        price = Web3.from_wei(sale[3], 'ether')
        nftContract = sale[0]
        tokenId = sale[2]

        nft_data = resolve_NFT(
            w3, nftContract, tokenId)
        nft = NFT(
            name=nft_data.name,
            image=nft_data.image,
            contract_address=nft_data.contract_address,
            token_id=nft_data.token_id,
        )

        sale_object = Sale(
            nft=nft,
            seller=sale[1],
            price=price,
            status=sale[4]
        )

        return sale_object

    def resolve_is_marketplace_approved(self, info, chainId, address, token_id):
        w3 = blockchainProvider(chainId)

        ERC721contract = w3.eth.contract(
            address=address, abi=boilerplateErc721ABI)

        is_approved = ERC721contract.functions.getApproved(
            token_id).call() == marketplaceAddress(chainId)
        return is_approved

    def resolve_is_token_for_sale(self, info, chainId, address, token_id):
        w3 = blockchainProvider(chainId)

        marketplace = w3.eth.contract(
            address=marketplaceAddress(chainId), abi=marketplaceABI)

        is_for_sale = marketplace.functions.isTokenForSale(
            address, token_id).call()

        return is_for_sale

    def resolve_is_admin(self, info, chainId, address):
        w3 = blockchainProvider(chainId)

        marketplace = w3.eth.contract(
            address=marketplaceAddress(chainId), abi=marketplaceABI)

        owner = marketplace.functions.owner().call()

        return owner == address

    def resolve_marketplace_royalty(self, info, chainId):
        w3 = blockchainProvider(chainId)

        marketplace = w3.eth.contract(
            address=marketplaceAddress(chainId), abi=marketplaceABI)

        royalty_value = marketplace.functions.getMarketplaceRoyalty().call()

        return royalty_value/100

    def resolve_marketplace_balance(self, info, chainId):
        w3 = blockchainProvider(chainId)

        balance = w3.eth.get_balance(marketplaceAddress(chainId))
        balance = Web3.from_wei(balance, 'ether')

        return balance


schema = graphene.Schema(query=Query)
