# Blockchain

This hardhat project is used to develop, test, and deploy the smart contracts to the Sepolia testnet and Hardhat local blockchain.

## Getting Started

1. Install dependencies

```bash
cd blockchain
yarn install
```

2. Compile the contracts

```bash
npx hardhat compile
```

3. Modify the `.env` file with the following information:

```bash
ALCHEMY_API_KEY = "your Alchemy Key"
PRIVATE_KEY = "your address private key"
```

Alchemy is the provider used to connect with a blockchain node, to get a free API key, follow this guide: [Alchemy Key](https://docs.alchemy.com/docs/alchemy-quickstart-guide#1key-create-an-alchemy-key)

The private key of your ethereum address is used to sign the deployment of the smart contracts. If you use Metamask, follow this guide: [Metamask Key](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)

### Sepolia Testnet

Follow the instruction to deploy the smart contracts to the Sepolia testnet

4. Run this script to deploy all contracts, copy the artifacts and update the _.env_ files

```bash
npx hardhat run scripts/deployAll-Sepolia.ts --network sepolia
```

### Hardhat Local Blockchain

Follow the instruction to deploy the smart contracts to the Hardhat local blockchain

4. Run the local blockchain

```bash
npx hardhat node
```

5. In another terminal run this script to deploy all contracts, copy the artifacts and update the _.env_ files

```bash
npx hardhat run scripts/deployAll-Local.ts --network localhost
```

## Testing

This project uses [Jest](https://jestjs.io/) as a testing framework.

To run the tests:

```bash
npx hardhat test
```
