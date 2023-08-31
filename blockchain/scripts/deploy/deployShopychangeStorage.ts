import { ethers } from "hardhat";
import { modifyEnv } from "../utilities/modifyEnv";
import { copyArtifacts } from "../utilities/copyArtifacts";

async function main() {
  const Storage = await ethers.getContractFactory("ShopychangeStorage");
  const storageContract = await Storage.deploy();

  storageContract.deployed();

  console.log("Storage address:", storageContract.address);

  const ERC2981MultiReceiverID =
    await storageContract.IERC2981MultiReceiver_ID();
  console.log("IERC2981MultiReceiver_ID:", ERC2981MultiReceiverID);
  const ERC2981ID = await storageContract.IERC2981_ID();
  console.log("IERC2981_ID:", ERC2981ID);

  modifyEnv(
    "REACT_APP_ERC2981_MULTI_RECEIVER_ID",
    ERC2981MultiReceiverID,
    "frontend/.env",
    true
  );

  modifyEnv(
    "REACT_APP_SEPOLIA_SHOPYCHANGE_STORAGE_ADDRESS",
    storageContract.address,
    "frontend/.env",
    true
  );

  modifyEnv(
    "SEPOLIA_SHOPYCHANGE_STORAGE_ADDRESS",
    storageContract.address,
    "backend/.env"
  );

  modifyEnv(
    "ERC2981_MULTI_RECEIVER_ID",
    ERC2981MultiReceiverID,
    "backend/.env"
  );

  modifyEnv("ERC2981_ID", ERC2981ID, "backend/.env");

  copyArtifacts("ShopychangeStorage", ["frontend/src/contracts"], "Storage");
  copyArtifacts(
    "ERC2981MultiReceiver",
    ["frontend/src/contracts", "backend/marketplaceAPI/contracts"],
    "RevenueShare"
  );
  copyArtifacts(
    "ShopychangePaymentSplitter",
    ["frontend/src/contracts", "backend/marketplaceAPI/contracts"],
    "ShopychangePaymentSplitter"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
