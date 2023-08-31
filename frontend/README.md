# Frontend

This module is a React application that fetch data from the backend and display it. It also allows to interact with the smart contract through wagmi library.

## Getting Started

1. Install dependencies

```bash
cd frontend
yarn install
```

2. Modify the `.env` file with the following information

```bash
REACT_APP_WALLET_CONNECT_ID="your Wallet Connect key"
REACT_APP_ALCHEMY_PROJECT_ID="your Alchemy project key"
REACT_APP_IPFS_API_KEY="your NFT Storage API key"
```

Wallet Connect is used to connect with a wallet like Metamask, to get a free API key, follow this guide: [Wallet Connect Key](https://cloud.walletconnect.com/sign-in)

Alchemy is the provider used to connect with a blockchain node, to get a free API key, follow this guide: [Alchemy Key](https://docs.alchemy.com/docs/alchemy-quickstart-guide#1key-create-an-alchemy-key)

NFT Storage is used to store the NFTs metadata, to get a free API key, follow this guide: [NFT Storage Key](https://nft.storage/docs/#get-an-api-token)

3. Start the development server

```bash
yarn start
```

Note:
Remember to configure your wallet to connect to the Hardhat network.
If you use Metamask, refer to this guide in case of problem "Nonce too high": [Nonce too high](https://medium.com/@thelasthash/solved-nonce-too-high-error-with-metamask-and-hardhat-adc66f092cd)

## Testing

### Unit tests

This project uses [Jest](https://jestjs.io/) as a testing framework.

To run the tests:

```bash
yarn test
```

### E2E tests

This project uses [Cypress](https://www.cypress.io/) as a testing framework, remember to start the blockchain local network and the frontend before running the tests.

To run the tests:

```bash
npx env-cmd cypress run --browser chrome --headed
```
