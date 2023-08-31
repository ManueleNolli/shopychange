import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.getContractAt(
    "BoilerplateERC721",
    "0x5BD90580E5ba272Ab11F7744a84448Dd7a719899"
  );

  // const result = await contract.setApprovalForAll(
  //   "0x8121270572A0c7319f9854dC0f4e1e9D30d36E56",
  //   false
  // );

  // const result = await contract.getApproved(1); // token id

  // transfer
  const result = await contract.transferFrom(
    "0x965A25dA356e75a58bEBEEA63C3050540259adB2",
    "0x963E5DbBcaeEA4c00bab65DdDce727EFd995DEa8",
    1
  );

  //burn
  // const result = await contract.burn(1);

  console.log("result:", result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
