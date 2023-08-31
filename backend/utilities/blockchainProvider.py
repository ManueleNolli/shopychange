from backend.settings import LOCAL_CHAIN_ID, SEPOLIA_CHAIN_ID, ALCHEMY_API_KEY
from web3 import Web3


def blockchainProvider(chainId: int):
    if chainId == int(SEPOLIA_CHAIN_ID):
        alchemy_url = f'https://eth-sepolia.g.alchemy.com/v2/{ALCHEMY_API_KEY}'
        return Web3(Web3.HTTPProvider(alchemy_url))
    elif chainId == int(LOCAL_CHAIN_ID):
        return Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
    else:
        raise Exception('Invalid chainId')
