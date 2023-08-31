import { ethers } from "hardhat";
import { copyArtifacts } from "../utilities/copyArtifacts";
import { modifyEnv } from "../utilities/modifyEnv";

async function main() {
  const shopychangeMarketplace = await ethers.getContractFactory(
    "ShopychangeMarketplace"
  );
  const shopychangeMarketplaceContract = await shopychangeMarketplace.deploy(0);

  shopychangeMarketplaceContract.deployed();

  console.log(
    "Shopychange Marketplace address:",
    shopychangeMarketplaceContract.address
  );

  copyArtifacts(
    "ShopychangeMarketplace",
    [
      "frontend/src/contracts",
      "backend/marketplaceAPI/contracts",
      "scripts/inequality/",
    ],
    "Marketplace"
  );

  modifyEnv(
    "REACT_APP_SEPOLIA_MARKETPLACE_ADDRESS",
    shopychangeMarketplaceContract.address,
    "frontend/.env",
    true
  );

  modifyEnv(
    "SEPOLIA_MARKETPLACE_ADDRESS",
    shopychangeMarketplaceContract.address,
    "backend/.env"
  );

  modifyEnv(
    "SEPOLIA_MARKETPLACE_ADDRESS",
    shopychangeMarketplaceContract.address,
    "scripts/inequality/.env"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
