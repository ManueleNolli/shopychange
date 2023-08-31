const { ethers } = require("hardhat");
const { expect } = require("chai");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";

describe("BoilerplateERC721", function () {
  let contractOwner: SignerWithAddress;
  let other: SignerWithAddress;
  let BoilerplateERC721: Contract;

  beforeEach(async function () {
    [contractOwner, other] = await ethers.getSigners();
    const BoilerplateERC721Factory = await ethers.getContractFactory(
      "BoilerplateERC721"
    );
    BoilerplateERC721 = await BoilerplateERC721Factory.connect(
      contractOwner
    ).deploy("BoilerplateERC721", "B721", [other.address], [100]);
    await BoilerplateERC721.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await BoilerplateERC721.owner()).to.equal(contractOwner.address);
    });

    it("Should set the right name", async function () {
      expect(await BoilerplateERC721.name()).to.equal("BoilerplateERC721");
    });

    it("Should set the right symbol", async function () {
      expect(await BoilerplateERC721.symbol()).to.equal("B721");
    });
  });

  describe("Mintable", function () {
    it("Should mint new token", async function () {
      await BoilerplateERC721.connect(contractOwner).mint(
        other.address,
        "ipfs://otherCID/randomValue"
      );
      expect(await BoilerplateERC721.balanceOf(contractOwner.address)).to.equal(
        0
      );
      expect(await BoilerplateERC721.balanceOf(other.address)).to.equal(1);
      expect(await BoilerplateERC721.tokenURI(0)).to.equal(
        "ipfs://otherCID/randomValue"
      );

      await BoilerplateERC721.connect(contractOwner).mint(
        contractOwner.address,
        "ipfs://otherCID/randomValue2"
      );
      expect(await BoilerplateERC721.balanceOf(contractOwner.address)).to.equal(
        1
      );
      expect(await BoilerplateERC721.balanceOf(other.address)).to.equal(1);
      expect(await BoilerplateERC721.tokenURI(1)).to.equal(
        "ipfs://otherCID/randomValue2"
      );
    });

    it("Should not mint new token if not owner", async function () {
      await expect(
        BoilerplateERC721.connect(other).mint(
          other.address,
          "ipfs://otherCID/randomValue"
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Burnable", function () {
    it("Should burn token", async function () {
      await BoilerplateERC721.connect(contractOwner).mint(
        contractOwner.address,
        "ipfs://otherCID/randomValue"
      );

      expect(await BoilerplateERC721.balanceOf(contractOwner.address)).to.equal(
        1
      );

      await BoilerplateERC721.connect(contractOwner).burn(0);
      expect(await BoilerplateERC721.balanceOf(contractOwner.address)).to.equal(
        0
      );
      await expect(BoilerplateERC721.tokenURI(0)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });

    it("Should not burn token if not owner", async function () {
      await BoilerplateERC721.connect(contractOwner).mint(
        contractOwner.address,
        "ipfs://otherCID/randomValue"
      );
      await expect(BoilerplateERC721.connect(other).burn(0)).to.be.revertedWith(
        "ERC721: caller is not token owner or approved"
      );
    });
  });

  describe("Support interface", function () {
    it("Should support interface IERC2981MultiReceiver", async function () {
      const result = await BoilerplateERC721.IERC2981MultiReceiver_ID();
      console.log(result);
    });
  });
});
