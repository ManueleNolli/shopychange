from graphql_types.types import Contract
from eth_utils import to_checksum_address
from backend.settings import boilerplateErc721ABI


def resolve_contract(w3, address):
    w3.contract = w3.eth.contract(address=address, abi=boilerplateErc721ABI)
    name = w3.contract.functions.name().call()
    symbol = w3.contract.functions.symbol().call()

    return Contract(
        name=name,
        symbol=symbol,
        address=address
    )
