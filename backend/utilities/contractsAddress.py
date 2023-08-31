from backend.settings import LOCAL_CHAIN_ID, SEPOLIA_CHAIN_ID,  SEPOLIA_MARKETPLACE_ADDRESS, LOCAL_MARKETPLACE_ADDRESS, SEPOLIA_SHOPYCHANGE_ERC721_FACTORY_ADDRESS, LOCAL_SHOPYCHANGE_ERC721_FACTORY_ADDRESS


def marketplaceAddress(chainId: int):
    if chainId == int(SEPOLIA_CHAIN_ID):
        return SEPOLIA_MARKETPLACE_ADDRESS
    elif chainId == int(LOCAL_CHAIN_ID):
        return LOCAL_MARKETPLACE_ADDRESS
    else:
        raise Exception(
            'Invalid chainId, contract not deployed on this network')


def factoryERC721Address(chainId: int):
    if chainId == int(SEPOLIA_CHAIN_ID):
        return SEPOLIA_SHOPYCHANGE_ERC721_FACTORY_ADDRESS
    elif chainId == int(LOCAL_CHAIN_ID):
        return LOCAL_SHOPYCHANGE_ERC721_FACTORY_ADDRESS
    else:
        raise Exception(
            'Invalid chainId, contract not deployed on this network')
