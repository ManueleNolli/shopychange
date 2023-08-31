import { ethers } from "hardhat";
import { modifyEnv } from "../utilities/modifyEnv";
import { copyArtifacts } from "../utilities/copyArtifacts";

async function main() {
  const ShopychangeERC721Factory = await ethers.getContractFactory(
    "ShopychangeERC721Factory"
  );
  const ShopychangeERC721FactoryContract =
    await ShopychangeERC721Factory.deploy();

  ShopychangeERC721FactoryContract.deployed();

  console.log(
    "ShopychangeERC721Factory address:",
    ShopychangeERC721FactoryContract.address
  );

  modifyEnv(
    "REACT_APP_SEPOLIA_SHOPYCHANGE_ERC721_FACTORY_ADDRESS",
    ShopychangeERC721FactoryContract.address,
    "frontend/.env",
    true
  );

  modifyEnv(
    "SEPOLIA_SHOPYCHANGE_ERC721_FACTORY_ADDRESS",
    ShopychangeERC721FactoryContract.address,
    "backend/.env"
  );

  copyArtifacts(
    "ShopychangeERC721Factory",
    ["frontend/src/contracts", "backend/factoryERC721API/contracts"],
    "FactoryERC721"
  );
  copyArtifacts(
    "BoilerplateERC721",
    ["frontend/src/contracts", "backend/factoryERC721API/contracts"],
    "FactoryERC721"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
