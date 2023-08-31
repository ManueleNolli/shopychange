import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  const shopychangeMarketplaceContract = await ethers.getContractAt(
    "ShopychangeMarketplaceOnlyMapping",
    "0x4350cF362B98e674F1a3bFAC51629A83E095E458" // Shopychange Marketplace address
  );

  const tx = await shopychangeMarketplaceContract.createSale(
    "0x6E11f15b909f6e22801DF6e7742a21cD578D946E", // Technological Animals NFT address
    "0x00000000",
    ethers.utils.parseEther("0.1")
  );
  tx.wait();

  console.log("Sale created");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
