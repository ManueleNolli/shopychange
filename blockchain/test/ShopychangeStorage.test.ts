const { ethers } = require("hardhat");
const { expect } = require("chai");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";

describe("ShopychangeStorage", function () {
  let storageContract: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const Storage = await ethers.getContractFactory("ShopychangeStorage");
    storageContract = await Storage.connect(owner).deploy();

    await storageContract.deployed();
  });

  describe("burnable", function () {
    it("should burn", async function () {
      const tokenURI = "https://tokenURI.com";
      await storageContract.connect(addr1).mint(tokenURI);
      expect(await storageContract.tokenURI(1)).to.equal(tokenURI);
      await storageContract.connect(addr1).burn(1);
      await expect(storageContract.tokenURI(1)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });

    it("should revert if is not the owner of the token", async function () {
      const tokenURI = "https://tokenURI.com";
      await storageContract.connect(addr1).mint(tokenURI);
      expect(await storageContract.tokenURI(1)).to.equal(tokenURI);
      await expect(storageContract.connect(addr2).burn(1)).to.be.revertedWith(
        "ShopychangeStorage: caller is not token owner or approved"
      );
    });
  });

  describe("mintable", function () {
    it("should mint with the correct id", async function () {
      // call mint and print return value

      const tokenURI = "https://tokenURI.com";
      const tx = await storageContract.connect(addr1).mint(tokenURI);
      const receipt = await tx.wait();
      const tokenId = receipt.events[0].args[2].toString();
      expect(await storageContract.tokenURI(tokenId)).to.equal(tokenURI);
      expect(tokenId).to.equal("1");

      const tx2 = await storageContract.connect(addr1).mint(tokenURI);
      const receipt2 = await tx2.wait();
      const tokenId2 = receipt2.events[0].args[2].toString();
      expect(await storageContract.tokenURI(tokenId2)).to.equal(tokenURI);
      expect(tokenId2).to.equal("2");
    });
  });
});
