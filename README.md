# Welcome to **Shopychange** marketplace

Shopychange is a DApp marketplace where you can create collections, nfts and sell, buy them. The marketplace include a royalty system that allows the creator of the collection to receive a percentage of the sale of the nft. The royalty system is implemented using a smart contract on the Ethereum blockchain.

Shopychange is a project developed by Manuele Nolli as his degree thesis in in Computer Science Bachelor at the University of Applied Sciences of Southern Switzerland (SUPSI).

## Requirements

To run the project you need to have installed the following software:

- **Node.js** the package manager chosed is _yarn_. You can download the latest version of Node.js on the [official website](https://nodejs.org/en/).
- **Docker Engine** to run the MongoDB container. You can download the latest version of Docker Engine on the [official website](https://docs.docker.com/engine/install/).
- **Python** to run the Django server. You can download the latest version of Python on the [official website](https://www.python.org/downloads/).

## Project Structure

There are four components to the project:

- Backend: Django
- Frontend: React
- Blockchain: Hardhat
- Database: MongoDB

## Getting Started

1. Firstly, clone the repository:

```bash
git clone https://gitlab-edu.supsi.ch/dti-isin/giuliano.gremlich/progetti_bachelor/2022_2023/nolli_manuele/shopychange.git
cd shopychange
```

2. Run docker-compose to start the containers of MongoDB

```bash
docker-compose up -d
```

3. RUn the copyEnv script to copy the .env files in the correct folders

```bash
node ./copyEnv.js
```

4. Go to the [blockchain](/blockchain/) folder and follow the instruction to start the Hardhat server

5. Go to the [backend](/backend/) folder and follow the instruction to start the Django server

6. Go to the [frontend](/frontend/) folder and follow the instruction to start the React server
