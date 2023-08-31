const { ethers } = require("hardhat");
const { expect } = require("chai");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";

import { SaleStatus } from "./Status";

describe("MarketplaceCancellable", function () {
  let contractOwner: SignerWithAddress;
  let seller: SignerWithAddress;
  let other: SignerWithAddress;
  let MarketplaceCancellable: Contract;
  let TechnologicalAnimals: Contract;

  beforeEach(async function () {
    [contractOwner, seller, other] = await ethers.getSigners();
    const MarketplaceCancellableFactory = await ethers.getContractFactory(
      "MarketplaceCancellable"
    );
    MarketplaceCancellable = await MarketplaceCancellableFactory.connect(
      contractOwner
    ).deploy();
    await MarketplaceCancellable.deployed();

    const TechnologicalAnimalsFactory = await ethers.getContractFactory(
      "TechnologicalAnimals"
    );
    TechnologicalAnimals = await TechnologicalAnimalsFactory.connect(
      contractOwner
    ).deploy();
    await TechnologicalAnimals.deployed();
  });

  describe("Cancel sale", function () {
    beforeEach(async function () {
      await TechnologicalAnimals.connect(contractOwner).safeMint(
        seller.address,
        "0x0001",
        "ipfs://test"
      );

      await TechnologicalAnimals.connect(seller).approve(
        MarketplaceCancellable.address,
        "0x0001"
      );

      await MarketplaceCancellable.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0001",
        ethers.utils.parseEther("1")
      );
    });

    it("Should cancel a sale Seller", async function () {
      await MarketplaceCancellable.connect(seller).cancelSale(
        TechnologicalAnimals.address,
        "0x0001"
      );

      const sale = await MarketplaceCancellable.getSale(
        TechnologicalAnimals.address,
        "0x0001"
      );

      expect(sale.status).to.equal(SaleStatus.CANCELLED);
    });

    it("Should cancel a sale Owner", async function () {
      await MarketplaceCancellable.connect(contractOwner).cancelSale(
        TechnologicalAnimals.address,
        "0x0001"
      );

      const sale = await MarketplaceCancellable.getSale(
        TechnologicalAnimals.address,
        "0x0001"
      );

      expect(sale.status).to.equal(SaleStatus.CANCELLED);
    });

    it("Should revert if it is not called by the seller or Owner", async function () {
      await expect(
        MarketplaceCancellable.connect(other).cancelSale(
          TechnologicalAnimals.address,
          "0x0001"
        )
      ).to.be.revertedWith("Only seller or admin can cancel sale");
    });

    it("Should revert if the token is not for sale", async function () {
      await MarketplaceCancellable.connect(other).buy(
        TechnologicalAnimals.address,
        "0x0001",
        { value: ethers.utils.parseEther("1") }
      );

      await expect(
        MarketplaceCancellable.connect(seller).cancelSale(
          TechnologicalAnimals.address,
          "0x0001"
        )
      ).to.be.revertedWith("Token is not for sale");
    });

    it("Should emit a SaleCancelled event", async function () {
      await expect(
        MarketplaceCancellable.connect(seller).cancelSale(
          TechnologicalAnimals.address,
          "0x0001"
        )
      )
        .to.emit(MarketplaceCancellable, "SaleCancelled")
        .withArgs(TechnologicalAnimals.address, "0x0001", seller.address);
    });

    it("Should stay integrate when cancel and create", async function () {
      await MarketplaceCancellable.connect(seller).cancelSale(
        TechnologicalAnimals.address,
        "0x0001"
      );

      const sales = await MarketplaceCancellable.getSales();

      const salesLenght = sales.length;
      expect(salesLenght).to.equal(1);

      await MarketplaceCancellable.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0001",
        ethers.utils.parseEther("2")
      );

      const sales2 = await MarketplaceCancellable.getSales();
      const salesLenght2 = sales2.length;
      expect(salesLenght2).to.equal(1);
    });
  });
});
