const { ethers } = require("hardhat");
const { expect } = require("chai");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";

describe("MarketplaceCleanable", function () {
  let contractOwner: SignerWithAddress;
  let seller: SignerWithAddress;
  let other: SignerWithAddress;
  let MarketplaceCleanable: Contract;
  let TechnologicalAnimals: Contract;

  beforeEach(async function () {
    [contractOwner, seller, other] = await ethers.getSigners();
    const MarketplaceCleanableFactory = await ethers.getContractFactory(
      "MarketplaceCleanable"
    );
    MarketplaceCleanable = await MarketplaceCleanableFactory.connect(
      contractOwner
    ).deploy();
    await MarketplaceCleanable.deployed();

    const TechnologicalAnimalsFactory = await ethers.getContractFactory(
      "TechnologicalAnimals"
    );
    TechnologicalAnimals = await TechnologicalAnimalsFactory.connect(
      contractOwner
    ).deploy();
    await TechnologicalAnimals.deployed();
  });

  describe("Clean storage", function () {
    beforeEach(async function () {
      await TechnologicalAnimals.connect(contractOwner).safeMint(
        seller.address,
        "0x0001",
        "ipfs://test"
      );

      await TechnologicalAnimals.connect(contractOwner).safeMint(
        seller.address,
        "0x0002",
        "ipfs://test"
      );

      await TechnologicalAnimals.connect(contractOwner).safeMint(
        seller.address,
        "0x0003",
        "ipfs://test"
      );

      await TechnologicalAnimals.connect(seller).setApprovalForAll(
        MarketplaceCleanable.address,
        true
      );
      await MarketplaceCleanable.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0001",
        ethers.utils.parseEther("1")
      );

      await MarketplaceCleanable.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0002",
        ethers.utils.parseEther("1")
      );

      await MarketplaceCleanable.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0003",
        ethers.utils.parseEther("1")
      );
    });

    it("Should clean storage", async function () {
      const sales = await MarketplaceCleanable.getSales();
      expect(sales.length).to.equal(3);

      await MarketplaceCleanable.connect(other).buy(
        TechnologicalAnimals.address,
        "0x0001",
        {
          value: ethers.utils.parseEther("1"),
        }
      );

      await MarketplaceCleanable.connect(contractOwner).cleanStorage();

      const salesAfter = await MarketplaceCleanable.getSales();
      expect(salesAfter.length).to.equal(2);

      await MarketplaceCleanable.connect(other).buy(
        TechnologicalAnimals.address,
        "0x0002",
        {
          value: ethers.utils.parseEther("1"),
        }
      );

      await MarketplaceCleanable.connect(contractOwner).cleanStorage();

      const salesAfter2 = await MarketplaceCleanable.getSales();
      expect(salesAfter2.length).to.equal(1);

      await MarketplaceCleanable.connect(other).buy(
        TechnologicalAnimals.address,
        "0x0003",
        {
          value: ethers.utils.parseEther("1"),
        }
      );

      await MarketplaceCleanable.connect(contractOwner).cleanStorage();

      const salesAfter3 = await MarketplaceCleanable.getSales();
      expect(salesAfter3.length).to.equal(0);
    });

    it("Should revert if not contract owner", async function () {
      await expect(
        MarketplaceCleanable.connect(other).cleanStorage()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should emit MarketplaceStorageCleaned event", async function () {
      await MarketplaceCleanable.connect(other).buy(
        TechnologicalAnimals.address,
        "0x0001",
        {
          value: ethers.utils.parseEther("1"),
        }
      );
      await expect(MarketplaceCleanable.connect(contractOwner).cleanStorage())
        .to.emit(MarketplaceCleanable, "MarketplaceStorageCleaned")
        .withArgs(1);
    });
  });

  describe("Clean inequalities", function () {
    beforeEach(async function () {
      await TechnologicalAnimals.connect(contractOwner).safeMint(
        seller.address,
        "0x0001",
        "ipfs://test"
      );

      await TechnologicalAnimals.connect(contractOwner).safeMint(
        seller.address,
        "0x0002",
        "ipfs://test"
      );

      await TechnologicalAnimals.connect(seller).setApprovalForAll(
        MarketplaceCleanable.address,
        true
      );
      await MarketplaceCleanable.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0001",
        ethers.utils.parseEther("1")
      );

      await MarketplaceCleanable.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0002",
        ethers.utils.parseEther("1")
      );
    });

    it("Should clean inequalities", async function () {
      const salesAfter = await MarketplaceCleanable.getSales();
      expect(salesAfter.length).to.equal(2);

      await TechnologicalAnimals.connect(seller).transferFrom(
        seller.address,
        other.address,
        "0x0001"
      );

      // Inequality created

      await MarketplaceCleanable.connect(contractOwner).cleanInequalities();

      const sales = await MarketplaceCleanable.getSales();
      expect(sales.length).to.equal(1);
      expect(salesAfter.length - 1).to.equal(sales.length);
    });

    it("Should revert if not contract owner", async function () {
      await expect(
        MarketplaceCleanable.connect(other).cleanInequalities()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should emit MarketplaceInequalitiesCleaned event", async function () {
      await TechnologicalAnimals.connect(seller).transferFrom(
        seller.address,
        other.address,
        "0x0001"
      );

      await expect(
        MarketplaceCleanable.connect(contractOwner).cleanInequalities()
      )
        .to.emit(MarketplaceCleanable, "MarketplaceInequalitiesCleaned")
        .withArgs(1);
    });
  });

  // describe("Clean sales", function () {
  //   beforeEach(async function () {
  //     await TechnologicalAnimals.connect(contractOwner).safeMint(
  //       seller.address,
  //       "0x0001",
  //       "ipfs://test"
  //     );

  //     await TechnologicalAnimals.connect(seller).setApprovalForAll(
  //       MarketplaceCleanable.address,
  //       true
  //     );
  //     await MarketplaceCleanable.connect(seller).createSale(
  //       TechnologicalAnimals.address,
  //       "0x0001",
  //       ethers.utils.parseEther("1")
  //     );
  //   });

  //   it("Should delete sale", async function () {
  //     const sales = await MarketplaceCleanable.getSales();
  //     expect(sales.length).to.equal(1);

  //     await MarketplaceCleanable.connect(contractOwner).deleteSale(
  //       TechnologicalAnimals.address,
  //       "0x0001"
  //     );

  //     const salesAfter = await MarketplaceCleanable.getSales();
  //     expect(salesAfter.length).to.equal(0);
  //   });

  //   it("Should revert if not contract owner", async function () {
  //     await expect(
  //       MarketplaceCleanable.connect(other).deleteSale(
  //         TechnologicalAnimals.address,
  //         "0x0001"
  //       )
  //     ).to.be.revertedWith("Ownable: caller is not the owner");
  //   });

  //   it("Should emit MarketplaceSaleDeleted event", async function () {
  //     await expect(
  //       MarketplaceCleanable.connect(contractOwner).deleteSale(
  //         TechnologicalAnimals.address,
  //         "0x0001"
  //       )
  //     )
  //       .to.emit(MarketplaceCleanable, "SaleDeleted")
  //       .withArgs(TechnologicalAnimals.address, "0x0001");
  //   });

  //   it("Should revert if sale does not exist", async function () {
  //     await expect(
  //       MarketplaceCleanable.connect(contractOwner).deleteSale(
  //         TechnologicalAnimals.address,
  //         "0x0002"
  //       )
  //     ).to.be.revertedWith("Sale does not exist");
  //   });

  //   it("Should revert if sale is not active", async function () {
  //     await MarketplaceCleanable.connect(other).buy(
  //       TechnologicalAnimals.address,
  //       "0x0001",
  //       {
  //         value: ethers.utils.parseEther("1"),
  //       }
  //     );

  //     await expect(
  //       MarketplaceCleanable.connect(contractOwner).deleteSale(
  //         TechnologicalAnimals.address,
  //         "0x0001"
  //       )
  //     ).to.be.revertedWith("Token is not for sale");
  //   });
  // });
});
