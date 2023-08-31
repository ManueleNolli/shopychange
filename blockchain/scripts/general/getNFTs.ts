import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  const shopychangeMarketplaceContract = await ethers.getContractAt(
    "ShopychangeMarketplaceOnlyMapping",
    "0xE018F021db76079D464849762Ca5b17dCE1152FC" // Shopychange Marketplace address
  );

  const result = await shopychangeMarketplaceContract.getNFTs();

  console.log("NFTs:", result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
