
import requests
from utilities.formatIpfsURI import format_IPFS_URI
from eth_utils import to_checksum_address
from graphql_types.types import NFT
from backend.settings import boilerplateErc721ABI


def resolve_NFT(w3, address, tokenId):
    w3.contract = w3.eth.contract(address=address, abi=boilerplateErc721ABI)
    tokenURI = w3.contract.functions.tokenURI(tokenId).call()

    # read metadata from IPFS
    tokenURI = format_IPFS_URI(tokenURI)
    metadata = requests.get(tokenURI).json()

    return NFT(
        contract_address=address,
        token_id=tokenId,
        image=format_IPFS_URI(metadata.get('image', '')),
        name=metadata.get('name', '')
    )
