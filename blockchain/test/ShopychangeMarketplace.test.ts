const { ethers } = require("hardhat");
const { expect } = require("chai");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";

describe("ShopychangeMarketplace", function () {
  let contractOwner: SignerWithAddress;
  let otherA: SignerWithAddress;
  let otherB: SignerWithAddress;
  let otherC: SignerWithAddress;
  let ShopychangeMarketplace: Contract;
  let BoilerplateERC721: Contract;

  beforeEach(async function () {
    [contractOwner, otherA, otherB, otherC] = await ethers.getSigners();
    const ShopychangeMarketplaceFactory = await ethers.getContractFactory(
      "ShopychangeMarketplace"
    );
    ShopychangeMarketplace = await ShopychangeMarketplaceFactory.connect(
      contractOwner
    ).deploy(100); // Start with 1% royalty
    await ShopychangeMarketplace.deployed();

    // Deploy a contract that will receive the royalties
    const BoilerplateERC721Factory = await ethers.getContractFactory(
      "BoilerplateERC721"
    );
    BoilerplateERC721 = await BoilerplateERC721Factory.connect(
      contractOwner
    ).deploy(
      "BoilerplateERC721",
      "B721",
      [otherA.address, otherB.address],
      [200, 100]
    );
    await BoilerplateERC721.deployed();
  });

  describe("Construction", function () {
    it("Should assign correct Marketplace royalty", async function () {
      const royalty = await ShopychangeMarketplace.getMarketplaceRoyalty();
      expect(royalty).to.equal(100);
    });
  });
  describe("Inheritance", function () {
    it("Should pay shares of marketplace and royalties", async function () {
      await BoilerplateERC721.connect(contractOwner).mint(
        otherA.address,
        "ipfs://test"
      );
      await BoilerplateERC721.connect(otherA).approve(
        ShopychangeMarketplace.address,
        "0x0000"
      );
      await ShopychangeMarketplace.connect(otherA).createSale(
        BoilerplateERC721.address,
        "0x0000",
        ethers.utils.parseEther("100.0")
      );

      const otherABalanceBefore = await otherA.getBalance(); // seller that receives 2% royalty
      const otherBBalanceBefore = await otherB.getBalance(); // account that receives 1% royalty
      const otherCBalanceBefore = await otherC.getBalance(); // buyer
      const marketplaceBalanceBefore = await ethers.provider.getBalance(
        // 1% marketplace
        ShopychangeMarketplace.address
      );

      // console.log("otherABalanceBefore", otherABalanceBefore.toString());
      // console.log("otherBBalanceBefore", otherBBalanceBefore.toString());
      // console.log("otherCBalanceBefore", otherCBalanceBefore.toString());
      // console.log(
      //   "marketplaceBalanceBefore",
      //   marketplaceBalanceBefore.toString()
      // );

      const royaltyInfo = await BoilerplateERC721.royaltyInfo(
        "0x0000",
        ethers.utils.parseEther("100.0")
      );

      const ShopychangePaymentSplitterAddress = royaltyInfo[0];
      const ShopychangePaymentSplitterBalanceBefore =
        await ethers.provider.getBalance(ShopychangePaymentSplitterAddress);
      console.log(
        "ShopychangePaymentSplitterBalanceBefore",
        ShopychangePaymentSplitterBalanceBefore.toString()
      );

      await ShopychangeMarketplace.connect(otherC).buy(
        BoilerplateERC721.address,
        "0x0000",
        { value: ethers.utils.parseEther("100.0") }
      );

      const otherABalanceAfter = await otherA.getBalance();
      const otherBBalanceAfter = await otherB.getBalance();
      const otherCBalanceAfter = await otherC.getBalance();
      const marketplaceBalanceAfter = await ethers.provider.getBalance(
        ShopychangeMarketplace.address
      );
      const ShopychangePaymentSplitterBalanceAfter =
        await ethers.provider.getBalance(ShopychangePaymentSplitterAddress);

      // console.log("otherABalanceAfter", otherABalanceAfter.toString());
      // console.log("otherBBalanceAfter", otherBBalanceAfter.toString());
      // console.log("otherCBalanceAfter", otherCBalanceAfter.toString());
      // console.log(
      //   "marketplaceBalanceAfter",
      //   marketplaceBalanceAfter.toString()
      // );
      // console.log(
      //   "ShopychangePaymentSplitterBalanceAfter",
      //   ShopychangePaymentSplitterBalanceAfter.toString()
      // );

      expect(marketplaceBalanceAfter).to.equal(
        marketplaceBalanceBefore.add(ethers.utils.parseEther("1.0"))
      ); // 1% of 100.0

      expect(ShopychangePaymentSplitterBalanceAfter).to.equal(
        ShopychangePaymentSplitterBalanceBefore.add(
          ethers.utils.parseEther("2.97")
        )
      ); // 2% of 99.0 + 1% of 99.0

      expect(otherCBalanceAfter).to.lessThan(
        otherCBalanceBefore.sub(ethers.utils.parseEther("100.0"))
      ); // 100.0 eth - gas

      expect(otherABalanceAfter).to.equal(
        otherABalanceBefore.add(ethers.utils.parseEther("96.03"))
      ); // 100eth - 1eth - 2.97eth

      // RELEASE PAYMENTSPLITTER
      const ShopychangePaymentSplitter = await ethers.getContractAt(
        "ShopychangePaymentSplitter",
        ShopychangePaymentSplitterAddress
      );

      await ShopychangePaymentSplitter.connect(contractOwner).release(0);
      await ShopychangePaymentSplitter.connect(contractOwner).release(1);

      const ShopychangePaymentSplitterBalanceAfterRelease =
        await ethers.provider.getBalance(ShopychangePaymentSplitterAddress);

      expect(ShopychangePaymentSplitterBalanceAfterRelease).to.equal(0);

      const otherABalanceAfterRelease = await otherA.getBalance();
      const otherBBalanceAfterRelease = await otherB.getBalance();
      // console.log(
      //   "otherABalanceAfterRelease",
      //   otherABalanceAfterRelease.toString()
      // );
      // console.log(
      //   "otherBBalanceAfterRelease",
      //   otherBBalanceAfterRelease.toString()
      // );

      expect(otherABalanceAfterRelease).to.equal(
        otherABalanceAfter.add(ethers.utils.parseEther("1.98"))
      );

      expect(otherBBalanceAfterRelease).to.equal(
        otherBBalanceAfter.add(ethers.utils.parseEther("0.99"))
      );
    });
  });
});
