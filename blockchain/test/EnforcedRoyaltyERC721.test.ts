const { ethers } = require("hardhat");
const { expect } = require("chai");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";

describe("EnforcedRoyaltyERC721", function () {
  let contractOwner: SignerWithAddress;
  let account1: SignerWithAddress;
  let account2: SignerWithAddress;
  let royaltyReceiver: SignerWithAddress;
  let marketplace: SignerWithAddress;
  let EnforcedRoyaltyERC721: Contract;

  beforeEach(async function () {
    [contractOwner, account1, account2, royaltyReceiver, marketplace] =
      await ethers.getSigners();
    const EnforcedRoyaltyERC721Factory = await ethers.getContractFactory(
      "EnforcedRoyaltyERC721"
    );
    EnforcedRoyaltyERC721 = await EnforcedRoyaltyERC721Factory.connect(
      contractOwner
    ).deploy("EnforcedRoyaltyERC721", "E721");
    await EnforcedRoyaltyERC721.deployed();
  });

  describe("Royalty", function () {
    beforeEach(async function () {
      await EnforcedRoyaltyERC721.connect(contractOwner).mint(
        account1.address,
        "ipfs://otherCID/randomValue"
      );

      await EnforcedRoyaltyERC721.connect(account1).setTokenRoyalty(
        0,
        royaltyReceiver.address,
        1000
      ); // 10%

      await EnforcedRoyaltyERC721.connect(account1).setTokenPrice(
        0,
        ethers.utils.parseEther("1")
      );

      await EnforcedRoyaltyERC721.connect(account1).approve(
        marketplace.address,
        0
      );
    });
    it("Should revert if transfer", async function () {
      await expect(
        EnforcedRoyaltyERC721.connect(account1).transferFrom(
          account1.address,
          account2.address,
          0
        )
      ).to.be.revertedWith(
        "EnforcedRoyaltyERC721: Must pay the royalty value before transfer"
      );
    });

    it("Should revert if transferFrom", async function () {
      await expect(
        EnforcedRoyaltyERC721.connect(account1).transferFrom(
          account1.address,
          account2.address,
          0
        )
      ).to.be.revertedWith(
        "EnforcedRoyaltyERC721: Must pay the royalty value before transfer"
      );
    });

    it("Should increment royaltyValueReceiver", async function () {
      await EnforcedRoyaltyERC721.connect(account2).payRoyalty(0, {
        value: ethers.utils.parseEther("0.1"),
      });

      const royaltyValueReceiver = await EnforcedRoyaltyERC721.getSaleInfo(0);

      expect(ethers.utils.formatEther(royaltyValueReceiver[1])).to.equal("0.1");
    });

    it("Should transfer when royalties paid", async function () {
      await EnforcedRoyaltyERC721.connect(account2).payRoyalty(0, {
        value: ethers.utils.parseEther("0.1"),
      });

      await EnforcedRoyaltyERC721.connect(marketplace).transferFrom(
        account1.address,
        account2.address,
        0
      );

      expect(await EnforcedRoyaltyERC721.ownerOf(0)).to.equal(account2.address);
    });

    it("Should send royalty", async function () {
      await EnforcedRoyaltyERC721.connect(account2).payRoyalty(0, {
        value: ethers.utils.parseEther("0.1"),
      });

      const royaltyReceiverBalanceBefore = await ethers.provider.getBalance(
        royaltyReceiver.address
      );

      await EnforcedRoyaltyERC721.connect(marketplace).transferFrom(
        account1.address,
        account2.address,
        0
      );

      const royaltyReceiverBalanceAfter = await ethers.provider.getBalance(
        royaltyReceiver.address
      );

      expect(
        royaltyReceiverBalanceAfter.sub(royaltyReceiverBalanceBefore)
      ).to.equal(ethers.utils.parseEther("0.1"));
    });

    it("Should clear royalty Received", async function () {
      await EnforcedRoyaltyERC721.connect(account2).payRoyalty(0, {
        value: ethers.utils.parseEther("0.1"),
      });

      await EnforcedRoyaltyERC721.connect(marketplace).transferFrom(
        account1.address,
        account2.address,
        0
      );

      const royaltyValueReceiver = await EnforcedRoyaltyERC721.getSaleInfo(0);

      expect(ethers.utils.formatEther(royaltyValueReceiver[1])).to.equal("0.0");
    });
  });
});
