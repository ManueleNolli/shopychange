import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  const technologicalAnimalsContract = await ethers.getContractAt(
    "TechnologicalAnimals",
    "0x6e11f15b909f6e22801df6e7742a21cd578d946e"
  );

  const tx = await technologicalAnimalsContract.safeMint(
    "0xe9eFbC61285d75198B3a58794E054C1F6aa44b25",
    7,
    "ipfs://bafkreich43pbjbjbfddypkvafivmx2anehd4yqscpofllvquprqj2cgcu4"
  );

  tx.wait();
  console.log("NFT minted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
