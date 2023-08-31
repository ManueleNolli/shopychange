import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  const ShopychangeERC721Factory = await ethers.getContractAt(
    "ShopychangeERC721Factory",
    "0x7592Cd6b7E73611b7Db0e19b3a40d083dFEFf418"
  );

  const tx = await ShopychangeERC721Factory.createERC721(
    "TestingRoyalty",
    "MFG721",
    "test://",
    2,
    [
      "0x963E5DbBcaeEA4c00bab65DdDce727EFd995DEa8",
      "0x965A25dA356e75a58bEBEEA63C3050540259adB2",
    ],
    [200, 100]
  );
  tx.wait();

  console.log("Done", tx);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
