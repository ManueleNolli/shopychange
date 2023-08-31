const { ethers } = require("hardhat");
const { expect } = require("chai");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";

describe("ShopychangePaymentSplitter", function () {
  let addressA: SignerWithAddress;
  let addressB: SignerWithAddress;
  let addressC: SignerWithAddress;
  let ShopychangePaymentSplitter: Contract;
  let contractOwner: SignerWithAddress;

  beforeEach(async function () {
    [addressA, addressB, addressC, contractOwner] = await ethers.getSigners();

    const ShopychangePaymentSplitterFactory = await ethers.getContractFactory(
      "ShopychangePaymentSplitter"
    );

    ShopychangePaymentSplitter =
      await ShopychangePaymentSplitterFactory.connect(contractOwner).deploy(
        [addressA.address, addressB.address],
        [200, 100]
      ); // 100 = 1%
    await ShopychangePaymentSplitter.deployed();
  });

  describe("ShopychangePaymentSplitter", function () {
    it("Should set correct default royalty amount", async function () {
      const receivers = await ShopychangePaymentSplitter.getReceivers();
      expect(receivers[0][0]).to.equal(addressA.address);
      expect(receivers[0][1]).to.equal(ethers.BigNumber.from(200)); // 2%
      expect(receivers[1][0]).to.equal(addressB.address);
      expect(receivers[1][1]).to.equal(ethers.BigNumber.from(100)); // 1%
    });

    it("Should add new receiver", async function () {
      await ShopychangePaymentSplitter.addReceiver(addressC.address, 300); // 3%
      const receivers = await ShopychangePaymentSplitter.getReceivers();
      expect(receivers.length).to.equal(3); // 3 receivers
      expect(receivers[2][0]).to.equal(addressC.address);
      expect(receivers[2][1]).to.equal(ethers.BigNumber.from(300)); // 3%
    });

    it("Should delete a receiver", async function () {
      await ShopychangePaymentSplitter.removeReceiver(0);
      const receivers = await ShopychangePaymentSplitter.getReceivers();
      expect(receivers.length).to.equal(1); // 1 receiver left
      expect(receivers[0][0]).to.equal(addressB.address);
      expect(receivers[0][1]).to.equal(ethers.BigNumber.from(100)); // 1%
    });

    it("Should split payment", async function () {
      const addressAInitialBalance = await addressA.getBalance();
      const addressBInitialBalance = await addressB.getBalance();

      // Buy of 100 ETH on ShopychangeMarketplace
      // ShopychangeMarketplace will send 3 ETH to ShopychangePaymentSplitter
      await addressC.sendTransaction({
        to: ShopychangePaymentSplitter.address,
        value: ethers.utils.parseEther("3.0"),
      });

      await ShopychangePaymentSplitter.connect(contractOwner).release(0);
      await ShopychangePaymentSplitter.connect(contractOwner).release(1);

      const addressAFinalBalance = await addressA.getBalance();
      const addressBFinalBalance = await addressB.getBalance();

      expect(addressAFinalBalance.sub(addressAInitialBalance)).to.equal(
        ethers.utils.parseEther("2.0")
      ); // 2%
      expect(addressBFinalBalance.sub(addressBInitialBalance)).to.equal(
        ethers.utils.parseEther("1.0")
      ); // 1%
    });
  });
});
