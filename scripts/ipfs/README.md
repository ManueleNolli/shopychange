# IPFS

This project is a enhancement of the [HashLips](https://github.com/HashLips/generative-art-node) project.

This node project is used to create NFTs and upload them to the IPFS network.

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Copy the `.env.example` file to `.env` and fill in the required values, the API key can be obtained from [NFT Storage](https://nft.storage/)

## Usage

### Create NFT

1. To generate NFTs it is necessary to provide different layers in the layers folder.
   A `layer` is an image that will be merged with the other layers to create the final NFT.
   Each layer type has its own folder, for example, the `background` layer type has its own folder in `layers/background`.

_Note_: Pay attention on how to name the layers folders and the layers files, they will be used to generate the NFT metadata.

2. Modify the `src/config.js` file to set the desired NFT properties as the layers order, percentage of appearance, rarity, collection and NFT name.

_Note_: Further personalisation are explained in the `src/config.js` file.

3. Run the following command to generate the NFTs:

```bash
npm run start create 50
```

_Note_: The number `50` is the number of NFTs to generate, it can be omitted to generate the default number of NFTs (5).
_Note_: Whenever you are happy with the NFTs generated, it is possible to proceed to upload them to the IPFS network.

### Upload NFT

1. Run the following command to upload the NFTs to the IPFS network:

```bash
npm run start upload
```

2. Once done, it will be printed the IPFS hash of the NFTs metadata and image folders. Example:

| Type     | CID                                                                | File                                                                   |
| -------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| metadata | ipfs://bafybeihvcpofx2gqy5aufxdqkfe5dutfcjozvhbogfoldhbra6ub4m6a6a | ipfs://bafybeihvcpofx2gqy5aufxdqkfe5dutfcjozvhbogfoldhbra6ub4m6a6a`/1` |
| image    | ipfs://bafybeibrxvj3ubavn6bbftbzbw3zatt7lbnxfu2uspqe64uzt6hl3bnxq4 | ipfs://bafybeibrxvj3ubavn6bbftbzbw3zatt7lbnxfu2uspqe64uzt6hl3bnxq4`/1` |

As it is possible to see there is no file type, so it is possible to use the baseURI field in the ERC721 standard to set the IPFS gateway URL.
