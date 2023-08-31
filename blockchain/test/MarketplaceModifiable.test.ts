const { ethers } = require("hardhat");
const { expect } = require("chai");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";

describe("MarketplaceModifiable", function () {
  let contractOwner: SignerWithAddress;
  let seller: SignerWithAddress;
  let other: SignerWithAddress;
  let MarketplaceModifiable: Contract;
  let TechnologicalAnimals: Contract;

  beforeEach(async function () {
    [contractOwner, seller, other] = await ethers.getSigners();
    const MarketplaceModifiableFactory = await ethers.getContractFactory(
      "MarketplaceModifiable"
    );
    MarketplaceModifiable = await MarketplaceModifiableFactory.connect(
      contractOwner
    ).deploy();
    await MarketplaceModifiable.deployed();

    const TechnologicalAnimalsFactory = await ethers.getContractFactory(
      "TechnologicalAnimals"
    );
    TechnologicalAnimals = await TechnologicalAnimalsFactory.connect(
      contractOwner
    ).deploy();
    await TechnologicalAnimals.deployed();
  });

  describe("Modify sale", function () {
    beforeEach(async function () {
      await TechnologicalAnimals.connect(contractOwner).safeMint(
        seller.address,
        "0x0001",
        "ipfs://test"
      );

      await TechnologicalAnimals.connect(seller).approve(
        MarketplaceModifiable.address,
        "0x0001"
      );

      await MarketplaceModifiable.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0001",
        ethers.utils.parseEther("1")
      );
    });

    it("Should modify the price of a sale", async function () {
      await MarketplaceModifiable.connect(seller).modifySalePrice(
        TechnologicalAnimals.address,
        "0x0001",
        ethers.utils.parseEther("2")
      );

      const sale = await MarketplaceModifiable.getSale(
        TechnologicalAnimals.address,
        "0x0001"
      );

      expect(sale.price).to.equal(ethers.utils.parseEther("2"));
      expect(sale.seller).to.equal(seller.address);
    });

    it("Should revert if it is not called by the seller", async function () {
      await expect(
        MarketplaceModifiable.connect(other).modifySalePrice(
          TechnologicalAnimals.address,
          "0x0001",
          ethers.utils.parseEther("2")
        )
      ).to.be.revertedWith("Only seller can call this function");
    });

    it("Should revert if the token is not for sale", async function () {
      await MarketplaceModifiable.connect(other).buy(
        TechnologicalAnimals.address,
        "0x0001",
        { value: ethers.utils.parseEther("1") }
      );

      await expect(
        MarketplaceModifiable.connect(seller).modifySalePrice(
          TechnologicalAnimals.address,
          "0x0001",
          ethers.utils.parseEther("2")
        )
      ).to.be.revertedWith("Token is not for sale");
    });

    it("Should revert if the price is not greater than 0", async function () {
      await expect(
        MarketplaceModifiable.connect(seller).modifySalePrice(
          TechnologicalAnimals.address,
          "0x0001",
          ethers.utils.parseEther("0")
        )
      ).to.be.revertedWith("Price must be greater than zero");
    });

    it("Should emit a SalePriceModified event", async function () {
      await expect(
        MarketplaceModifiable.connect(seller).modifySalePrice(
          TechnologicalAnimals.address,
          "0x0001",
          ethers.utils.parseEther("2")
        )
      )
        .to.emit(MarketplaceModifiable, "SalePriceModified")
        .withArgs(
          TechnologicalAnimals.address,
          "0x0001",
          seller.address,
          ethers.utils.parseEther("1"),
          ethers.utils.parseEther("2")
        );
    });
  });
});
