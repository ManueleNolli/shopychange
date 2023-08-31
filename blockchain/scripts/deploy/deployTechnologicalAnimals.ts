import { ethers } from "hardhat";

async function main() {
  const technologicalAnimals = await ethers.getContractFactory(
    "TechnologicalAnimals"
  );
  const technologicalAnimalsContract = await technologicalAnimals.deploy();

  technologicalAnimalsContract.deployed();

  console.log(
    "Technological Animals address:",
    technologicalAnimalsContract.address
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
