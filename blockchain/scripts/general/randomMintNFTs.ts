import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  const planetContract = await ethers.getContractAt(
    "Planet",
    "0x8adCEcF758D952EBCa1417daEC041cFE2Ce7BBD3"
  );

  const futureOwner = [
    "0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced",
    "0xe9eFbC61285d75198B3a58794E054C1F6aa44b25",
    "0x965A25dA356e75a58bEBEEA63C3050540259adB2",
  ];

  const nftCount = 200;
  for (let i = 0; i < nftCount; i++) {
    const idOwner = Math.floor(Math.random() * futureOwner.length);
    const tx = await planetContract.safeMint(futureOwner[idOwner], i);
    await tx.wait();
    console.log("NFT", i, "minted to", futureOwner[idOwner]);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
