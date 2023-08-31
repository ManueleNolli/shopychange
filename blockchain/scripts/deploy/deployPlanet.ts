import { ethers } from "hardhat";

async function main() {
  const Planet = await ethers.getContractFactory("Planet");
  const planetContract = await Planet.deploy(
    "ipfs://bafybeifwbkih42yyc34pnpnnlnn5m5ckns7ysbiqmk52wej36xsiepgcuu/"
  );

  planetContract.deployed();

  console.log("Planet address:", planetContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
