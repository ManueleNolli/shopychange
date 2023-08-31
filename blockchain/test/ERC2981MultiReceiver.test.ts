const { ethers } = require("hardhat");
const { expect } = require("chai");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";

describe("ERC2981MultiReceiver", function () {
  let addressA: SignerWithAddress;
  let addressB: SignerWithAddress;
  let addressC: SignerWithAddress;
  let ERC2981MultiReceiver: Contract;
  let contractOwner: SignerWithAddress;

  beforeEach(async function () {
    [addressA, addressB, addressC, contractOwner] = await ethers.getSigners();

    const ERC2981MultiReceiverFactory = await ethers.getContractFactory(
      "ERC2981MultiReceiver"
    );

    ERC2981MultiReceiver = await ERC2981MultiReceiverFactory.connect(
      contractOwner
    ).deploy([addressA.address], [100]); // 100 = 1%
    await ERC2981MultiReceiver.deployed();
  });

  describe("Royalty - One account", function () {
    beforeEach(async function () {
      const ERC2981MultiReceiverFactory = await ethers.getContractFactory(
        "ERC2981MultiReceiver"
      );

      ERC2981MultiReceiver = await ERC2981MultiReceiverFactory.connect(
        contractOwner
      ).deploy([addressA.address], [100]); // 100 = 1%
      await ERC2981MultiReceiver.deployed();
    });

    it("Should set correct default royalty amount", async function () {
      expect(await ERC2981MultiReceiver.royaltyInfo(0, 100)).to.eql([
        addressA.address,
        ethers.BigNumber.from(1),
      ]);
      expect(await ERC2981MultiReceiver.hasDefaultPaymentSplitter()).to.equal(
        false
      );
    });
    it("Should set personalized royalty amount for token", async function () {
      await ERC2981MultiReceiver.setTokenRoyalty(1, [addressB.address], [200]); // token 1 2% to addressB
      expect(await ERC2981MultiReceiver.royaltyInfo(1, 100)).to.eql([
        addressB.address,
        ethers.BigNumber.from(2),
      ]);
      expect(await ERC2981MultiReceiver.hasPaymentSplitter(1)).to.equal(false);
      expect(await ERC2981MultiReceiver.hasDefaultPaymentSplitter()).to.equal(
        false
      );
    });

    it("Should set personalized royalty amount for token and reset", async function () {
      await ERC2981MultiReceiver.setTokenRoyalty(1, [addressB.address], [200]); // token 1 2% to addressB
      expect(await ERC2981MultiReceiver.royaltyInfo(1, 100)).to.eql([
        addressB.address,
        ethers.BigNumber.from(2),
      ]);

      await ERC2981MultiReceiver.connect(contractOwner).resetTokenRoyalty(1); // reset token 1
      expect(await ERC2981MultiReceiver.royaltyInfo(1, 100)).to.eql([
        addressA.address,
        ethers.BigNumber.from(1),
      ]);
    });

    it("Should delete default royalty", async function () {
      await ERC2981MultiReceiver.setTokenRoyalty(1, [addressB.address], [200]); // token 1 2% to addressB
      expect(await ERC2981MultiReceiver.royaltyInfo(1, 100)).to.eql([
        addressB.address,
        ethers.BigNumber.from(2),
      ]);

      await ERC2981MultiReceiver.connect(contractOwner).deleteDefaultRoyalty();

      // token 0 should be 0%
      expect(await ERC2981MultiReceiver.royaltyInfo(0, 100)).to.eql([
        "0x0000000000000000000000000000000000000000",
        ethers.BigNumber.from(0),
      ]);

      // token 1 should be 2%
      expect(await ERC2981MultiReceiver.royaltyInfo(1, 100)).to.eql([
        addressB.address,
        ethers.BigNumber.from(2),
      ]);
    });
  });

  describe("Royalty - Multi account", function () {
    beforeEach(async function () {
      const ERC2981MultiReceiverFactory = await ethers.getContractFactory(
        "ERC2981MultiReceiver"
      );

      ERC2981MultiReceiver = await ERC2981MultiReceiverFactory.connect(
        contractOwner
      ).deploy([addressA.address, addressB.address], [250, 100]);
      await ERC2981MultiReceiver.deployed();
    });

    it("Should set correct default royalty amount", async function () {
      const royaltyInfo = await ERC2981MultiReceiver.royaltyInfo(0, 10000);
      const ShopychangePaymentSplitter = await ethers.getContractAt(
        "ShopychangePaymentSplitter",
        royaltyInfo[0]
      );

      expect(await ERC2981MultiReceiver.hasDefaultPaymentSplitter()).to.equal(
        true
      );

      const receivers = await ShopychangePaymentSplitter.getReceivers();
      expect(receivers[0][0]).to.equal(addressA.address);
      expect(receivers[0][1]).to.equal(ethers.BigNumber.from(250)); // 2.5%
      expect(receivers[1][0]).to.equal(addressB.address);
      expect(receivers[1][1]).to.equal(ethers.BigNumber.from(100)); // 1%
      expect(royaltyInfo[1]).to.equal(ethers.BigNumber.from(350)); // 3.5%
    });

    it("Should set multiple royalty accounts for token", async function () {
      const addresses = [addressA.address, addressB.address, addressC.address];
      const royalties = [200, 100, 500];

      expect(await ERC2981MultiReceiver.hasPaymentSplitter(1)).to.equal(false);

      await ERC2981MultiReceiver.setTokenRoyalty(1, addresses, royalties); // token 1

      expect(await ERC2981MultiReceiver.hasPaymentSplitter(1)).to.equal(true);

      const royaltyInfo = await ERC2981MultiReceiver.royaltyInfo(1, 100);

      expect(royaltyInfo[1]).to.equal(ethers.BigNumber.from(8)); // 8%

      const ShopychangePaymentSplitter = await ethers.getContractAt(
        "ShopychangePaymentSplitter",
        royaltyInfo[0]
      );

      const receivers = await ShopychangePaymentSplitter.getReceivers();
      expect(receivers[0][0]).to.equal(addressA.address);
      expect(receivers[0][1]).to.equal(ethers.BigNumber.from(200)); // 2%
      expect(receivers[1][0]).to.equal(addressB.address);
      expect(receivers[1][1]).to.equal(ethers.BigNumber.from(100)); // 1%
      expect(receivers[2][0]).to.equal(addressC.address);
      expect(receivers[2][1]).to.equal(ethers.BigNumber.from(500)); // 5%
    });
  });
});
