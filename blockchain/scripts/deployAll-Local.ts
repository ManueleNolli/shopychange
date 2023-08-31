import { ethers } from "hardhat";
import { modifyEnv } from "./utilities/modifyEnv";

async function deployMarketplace() {
  const ShopychangeMarketplace = await ethers.getContractFactory(
    "ShopychangeMarketplace"
  );

  const royalty = 50; // basevalue 10000 = 100%, 1000 = 10%, 100 = 1%, 10 = 0.1%, 1 = 0.01%
  const shopychangeMarketplaceContract = await ShopychangeMarketplace.deploy(
    royalty
  );

  shopychangeMarketplaceContract.deployed();

  console.log(
    "Shopychange Marketplace local network address:",
    shopychangeMarketplaceContract.address
  );

  modifyEnv(
    "REACT_APP_LOCAL_MARKETPLACE_ADDRESS",
    shopychangeMarketplaceContract.address,
    "frontend/.env",
    true
  );

  modifyEnv(
    "LOCAL_MARKETPLACE_ADDRESS",
    shopychangeMarketplaceContract.address,
    "backend/.env"
  );
}

async function deployERC721Factory() {
  const ShopychangeERC721Factory = await ethers.getContractFactory(
    "ShopychangeERC721Factory"
  );
  const ShopychangeERC721FactoryContract =
    await ShopychangeERC721Factory.deploy();
  ShopychangeERC721FactoryContract.deployed();
  console.log(
    "ShopychangeERC721Factory local network address:",
    ShopychangeERC721FactoryContract.address
  );

  modifyEnv(
    "REACT_APP_LOCAL_SHOPYCHANGE_ERC721_FACTORY_ADDRESS",
    ShopychangeERC721FactoryContract.address,
    "frontend/.env",
    true
  );
  modifyEnv(
    "LOCAL_SHOPYCHANGE_ERC721_FACTORY_ADDRESS",
    ShopychangeERC721FactoryContract.address,
    "backend/.env"
  );
}

async function deployStorage() {
  const Storage = await ethers.getContractFactory("ShopychangeStorage");
  const storageContract = await Storage.deploy();

  storageContract.deployed();

  console.log("Storage local network address:", storageContract.address);

  const ERC2981MultiReceiverID =
    await storageContract.IERC2981MultiReceiver_ID();
  console.log("IERC2981MultiReceiver_ID:", ERC2981MultiReceiverID);
  const ERC2981ID = await storageContract.IERC2981_ID();
  console.log("IERC2981_ID:", ERC2981ID);

  modifyEnv(
    "REACT_APP_LOCAL_SHOPYCHANGE_STORAGE_ADDRESS",
    storageContract.address,
    "frontend/.env",
    true
  );

  modifyEnv(
    "ERC2981_MULTI_RECEIVER_ID",
    ERC2981MultiReceiverID,
    "backend/.env"
  );

  modifyEnv("ERC2981_ID", ERC2981ID, "backend/.env");
}

async function main() {
  // Deploying the Shopychange Marketplace contract
  await deployMarketplace();

  // Deploying the ERC721 Factory contract
  await deployERC721Factory();

  // Deploying the Storage contract
  await deployStorage();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
