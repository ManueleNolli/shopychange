import json
from web3 import Web3

# ENV #
import os
from dotenv import load_dotenv
load_dotenv()
ALCHEMY_API_KEY = os.getenv('ALCHEMY_API_KEY')
MARKET_ADDRESS = os.getenv('SEPOLIA_MARKETPLACE_ADDRESS')
PRIVATE_KEY = os.getenv('PRIVATE_KEY')

w3 = Web3(Web3.HTTPProvider(
    'https://eth-sepolia.g.alchemy.com/v2/' + ALCHEMY_API_KEY))

# Get the contract ABI
data = open('ShopychangeMarketplace.json').read()
abi = json.loads(data)['abi']

erc721_abi_data = open('ERC721ABI.json').read()
erc721_abi = json.loads(erc721_abi_data)

# Get the contract
contractMarketplace = w3.eth.contract(address=MARKET_ADDRESS, abi=abi)


def get_market_sales():
    return contractMarketplace.functions.getSales().call()


def check_inequality(last_checked_block: int, current_block: int, sale):
    saleAddress = sale[0]
    saleTokenId = sale[2]

    print(sale)

    # Get Transfer event from NFT contract
    contract = w3.eth.contract(
        address=saleAddress, abi=erc721_abi)
    eventTransfer = contract.events.Transfer().create_filter(
        fromBlock=last_checked_block+1, toBlock=current_block,
        argument_filters={"tokenId": saleTokenId}).get_all_entries()

    # Get SaleBought event from Marketplace contract
    eventBought = contractMarketplace.events.SaleBought().create_filter(
        fromBlock=last_checked_block+1, toBlock=current_block,
        argument_filters={"contractAddress": saleAddress, "tokenId": saleTokenId}).get_all_entries()

    # If there is a transfer event and no SaleBought event means that the transfer is done outside the marketplace
    # If there is a transfer event and a SaleBought event means that the transfer is done inside the marketplace
    if (len(eventTransfer) > 0 and len(eventBought) == 0):
        return True
    else:
        return False


def cancel_sale(sale):
    saleAddress = sale[0]
    saleTokenId = sale[2]

    account = w3.eth.account.from_key(PRIVATE_KEY)

    nonce = w3.eth.get_transaction_count(account.address)

    txn = contractMarketplace.functions.cancelSale(
        saleAddress, saleTokenId).build_transaction({
            'from': account.address,
            'nonce': nonce,
            'gas': 1000000,
            'gasPrice': w3.to_wei('5', 'gwei')
        })

    signed_txn = w3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)

    txn_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)

    print(
        f"sale {saleAddress} {saleTokenId} cancelled with hash {txn_hash.hex()}")


def main():
    last_checked_block = w3.eth.block_number

    while True:
        if (last_checked_block == w3.eth.block_number):
            continue

        print("New block!")
        print("Last checked block: " + str(last_checked_block))
        print("Current block: " + str(w3.eth.block_number))
        # New block
        current_block = w3.eth.block_number

        # Get sales
        sales = get_market_sales()

        # filter sale only if sale[4] == 3 (sale is active)
        sales = [sale for sale in sales if sale[4] == 3]

        # Wait for event
        for sale in sales:
            result = check_inequality(last_checked_block, current_block, sale)

            if (result):
                print("Inequality found!")
                cancel_sale(sale)

        # Prints
        # print(event)

        last_checked_block = current_block


# main
if __name__ == '__main__':
    main()
