const { ethers } = require("hardhat");
const { expect } = require("chai");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";
import { SaleStatus } from "./Status";

describe("MarketplaceFundamental", function () {
  let contractOwner: SignerWithAddress;
  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;
  let other: SignerWithAddress;
  let MarketplaceFundamental: Contract;
  let TechnologicalAnimals: Contract;

  beforeEach(async function () {
    [contractOwner, seller, buyer, other] = await ethers.getSigners();
    const MarketplaceFundamentalFactory = await ethers.getContractFactory(
      "MarketplaceFundamental"
    );
    MarketplaceFundamental = await MarketplaceFundamentalFactory.connect(
      contractOwner
    ).deploy();
    await MarketplaceFundamental.deployed();

    const TechnologicalAnimalsFactory = await ethers.getContractFactory(
      "TechnologicalAnimals"
    );
    TechnologicalAnimals = await TechnologicalAnimalsFactory.connect(
      contractOwner
    ).deploy();
    await TechnologicalAnimals.deployed();
  });

  describe("Approvation", function () {
    it("Should approve the marketplace to transfer one token", async function () {
      await TechnologicalAnimals.connect(contractOwner).safeMint(
        seller.address,
        "0x0001",
        "ipfs://test"
      );

      await TechnologicalAnimals.connect(seller).approve(
        MarketplaceFundamental.address,
        "0x0001"
      );

      const approvedAddress = await TechnologicalAnimals.getApproved("0x0001");
      expect(approvedAddress).to.equal(MarketplaceFundamental.address);
    });

    it("Should approve the marketplace to transfer all tokens", async function () {
      await TechnologicalAnimals.connect(contractOwner).safeMint(
        seller.address,
        "0x0001",
        "ipfs://test"
      );

      await TechnologicalAnimals.connect(seller).setApprovalForAll(
        MarketplaceFundamental.address,
        true
      );

      const approvedAddress = await TechnologicalAnimals.isApprovedForAll(
        seller.address,
        MarketplaceFundamental.address
      );
      expect(approvedAddress).to.equal(true);
    });
  });

  describe("Selling", function () {
    beforeEach(async function () {
      await TechnologicalAnimals.connect(contractOwner).safeMint(
        seller.address,
        "0x0001",
        "ipfs://test"
      );

      await TechnologicalAnimals.connect(seller).approve(
        MarketplaceFundamental.address,
        "0x0001"
      );
    });

    it("Should sell an NFT", async function () {
      await MarketplaceFundamental.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0001",
        ethers.utils.parseEther("1")
      );

      const sale = await MarketplaceFundamental.getSale(
        TechnologicalAnimals.address,
        "0x0001"
      );
      expect(sale.seller).to.equal(seller.address);
      expect(sale.price).to.equal(ethers.utils.parseEther("1"));
      expect(sale.status).to.equal(SaleStatus.LISTED);
      expect(sale.contractAddress).to.equal(TechnologicalAnimals.address);
      expect(sale.tokenId).to.equal("0x0001");
    });

    it("Should revert if the price is not greater than zero", async function () {
      await expect(
        MarketplaceFundamental.connect(seller).createSale(
          TechnologicalAnimals.address,
          "0x0001",
          ethers.utils.parseEther("0")
        )
      ).to.be.revertedWith("Price must be greater than zero");
    });

    it("Should revert if the token is already for sale", async function () {
      await MarketplaceFundamental.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0001",
        ethers.utils.parseEther("1")
      );

      await expect(
        MarketplaceFundamental.connect(seller).createSale(
          TechnologicalAnimals.address,
          "0x0001",
          ethers.utils.parseEther("1")
        )
      ).to.be.revertedWith("Token is already for sale");
    });

    it("Should revert if MarketplaceFundamental is not approved to transfer the token", async function () {
      await TechnologicalAnimals.connect(contractOwner).safeMint(
        seller.address,
        "0x0002",
        "ipfs://test"
      );

      await expect(
        MarketplaceFundamental.connect(seller).createSale(
          TechnologicalAnimals.address,
          "0x0002",
          ethers.utils.parseEther("1")
        )
      ).to.be.revertedWith("Shopychange is not approved to manage this token");
    });

    it("Should revert if the seller is not the owner of the token", async function () {
      await expect(
        MarketplaceFundamental.connect(other).createSale(
          TechnologicalAnimals.address,
          "0x0001",
          ethers.utils.parseEther("1")
        )
      ).to.be.revertedWith("You are not the owner of this token");
    });

    it("Should emit a SaleCreated event", async function () {
      await expect(
        MarketplaceFundamental.connect(seller).createSale(
          TechnologicalAnimals.address,
          "0x0001",
          ethers.utils.parseEther("1")
        )
      )
        .to.emit(MarketplaceFundamental, "SaleCreated")
        .withArgs(
          TechnologicalAnimals.address,
          "0x0001",
          seller.address,
          ethers.utils.parseEther("1")
        );
    });
  });

  describe("Buying", function () {
    beforeEach(async function () {
      await TechnologicalAnimals.connect(contractOwner).safeMint(
        seller.address,
        "0x0001",
        "ipfs://test"
      );

      await TechnologicalAnimals.connect(seller).approve(
        MarketplaceFundamental.address,
        "0x0001"
      );

      await MarketplaceFundamental.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0001",
        ethers.utils.parseEther("1")
      );
    });

    it("Should buy an NFT", async function () {
      await MarketplaceFundamental.connect(buyer).buy(
        TechnologicalAnimals.address,
        "0x0001",
        { value: ethers.utils.parseEther("1") }
      );

      const sale = await MarketplaceFundamental.getSale(
        TechnologicalAnimals.address,
        "0x0001"
      );
      expect(sale.status).to.equal(SaleStatus.SOLD);
      const NftOwner = await TechnologicalAnimals.ownerOf("0x0001");
      expect(NftOwner).to.equal(buyer.address);
    });

    it("Should update the balance", async function () {
      const sellerBalanceBefore = await ethers.provider.getBalance(
        seller.address
      );
      const buyerBalanceBefore = await ethers.provider.getBalance(
        buyer.address
      );

      await MarketplaceFundamental.connect(buyer).buy(
        TechnologicalAnimals.address,
        "0x0001",
        { value: ethers.utils.parseEther("1") }
      );

      const sellerBalanceAfter = await ethers.provider.getBalance(
        seller.address
      );
      const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);

      expect(sellerBalanceAfter).to.equal(
        sellerBalanceBefore.add(ethers.utils.parseEther("1"))
      );
      expect(buyerBalanceAfter).to.be.lessThan(
        // less than because of gas fees
        buyerBalanceBefore.sub(ethers.utils.parseEther("1"))
      );
    });

    it("Should revert if the sale does not exist", async function () {
      await expect(
        MarketplaceFundamental.connect(buyer).buy(
          TechnologicalAnimals.address,
          "0x0002",
          { value: ethers.utils.parseEther("1") }
        )
      ).to.be.revertedWith("Sale does not exist");
    });

    it("Should revert if trying to buy your own NFT", async function () {
      await expect(
        MarketplaceFundamental.connect(seller).buy(
          TechnologicalAnimals.address,
          "0x0001",
          { value: ethers.utils.parseEther("1") }
        )
      ).to.be.revertedWith("You cannot buy your own NFT");
    });

    it("Should revert if the seller is no longer the owner of the token", async function () {
      await TechnologicalAnimals.connect(seller).transferFrom(
        seller.address,
        other.address,
        "0x0001"
      );

      await expect(
        MarketplaceFundamental.connect(buyer).buy(
          TechnologicalAnimals.address,
          "0x0001",
          { value: ethers.utils.parseEther("1") }
        )
      ).to.be.revertedWith("Seller is no longer the owner of the token");
    });

    it("Should revert if the price is not equal to the sale price", async function () {
      await expect(
        MarketplaceFundamental.connect(buyer).buy(
          TechnologicalAnimals.address,
          "0x0001",
          { value: ethers.utils.parseEther("2") }
        )
      ).to.be.revertedWith("Price is not equal to the sale price");
    });

    it("Should emit a SaleBought event", async function () {
      await expect(
        MarketplaceFundamental.connect(buyer).buy(
          TechnologicalAnimals.address,
          "0x0001",
          { value: ethers.utils.parseEther("1") }
        )
      )
        .to.emit(MarketplaceFundamental, "SaleBought")
        .withArgs(
          TechnologicalAnimals.address,
          "0x0001",
          seller.address,
          buyer.address,
          ethers.utils.parseEther("1")
        );
    });
  });

  describe("Getter", function () {
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
        MarketplaceFundamental.address,
        true
      );

      await MarketplaceFundamental.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0001",
        ethers.utils.parseEther("1")
      );

      await MarketplaceFundamental.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0002",
        ethers.utils.parseEther("1")
      );
    });

    it("Should get the sale of an NFT", async function () {
      const sale = await MarketplaceFundamental.getSale(
        TechnologicalAnimals.address,
        "0x0001"
      );
      expect(sale.status).to.equal(SaleStatus.LISTED);
      expect(sale.seller).to.equal(seller.address);
      expect(sale.price).to.equal(ethers.utils.parseEther("1"));
      expect(sale.contractAddress).to.equal(TechnologicalAnimals.address);
      expect(sale.tokenId).to.equal("0x0001");
    });

    it("Should get all sales", async function () {
      const sales = await MarketplaceFundamental.getSales();
      expect(sales.length).to.equal(2);
      expect(sales[0].status).to.equal(SaleStatus.LISTED);
      expect(sales[0].seller).to.equal(seller.address);
      expect(sales[0].price).to.equal(ethers.utils.parseEther("1"));
      expect(sales[0].contractAddress).to.equal(TechnologicalAnimals.address);
      expect(sales[0].tokenId).to.equal("0x0001");
      expect(sales[1].status).to.equal(SaleStatus.LISTED);
      expect(sales[1].seller).to.equal(seller.address);
      expect(sales[1].price).to.equal(ethers.utils.parseEther("1"));
      expect(sales[1].contractAddress).to.equal(TechnologicalAnimals.address);
      expect(sales[1].tokenId).to.equal("0x0002");
    });

    it("Should get correct sale if sold and listed", async function () {
      await MarketplaceFundamental.connect(buyer).buy(
        TechnologicalAnimals.address,
        "0x0001",
        { value: ethers.utils.parseEther("1") }
      );

      const sale = await MarketplaceFundamental.getSale(
        TechnologicalAnimals.address,
        "0x0001"
      );

      expect(sale.status).to.equal(SaleStatus.SOLD);
      expect(sale.seller).to.equal(seller.address);

      await TechnologicalAnimals.connect(buyer).approve(
        MarketplaceFundamental.address,
        "0x0001"
      );

      await MarketplaceFundamental.connect(buyer).createSale(
        TechnologicalAnimals.address,
        "0x0001",
        ethers.utils.parseEther("2")
      );

      const sale2 = await MarketplaceFundamental.getSale(
        TechnologicalAnimals.address,
        "0x0001"
      );

      expect(sale2.status).to.equal(SaleStatus.LISTED);
      expect(sale2.seller).to.equal(buyer.address);
      expect(sale2.price).to.equal(ethers.utils.parseEther("2"));
    });
  });

  describe("Is token for sale", function () {
    it("Should return if a token is listed", async function () {
      await TechnologicalAnimals.connect(contractOwner).safeMint(
        seller.address,
        "0x0001",
        "ipfs://test"
      );

      await TechnologicalAnimals.connect(seller).setApprovalForAll(
        MarketplaceFundamental.address,
        true
      );

      await MarketplaceFundamental.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0001",
        ethers.utils.parseEther("1")
      );

      expect(
        await MarketplaceFundamental.isTokenForSale(
          TechnologicalAnimals.address,
          "0x0001"
        )
      ).to.equal(true);
    });

    it("Should return if a token is not listed", async function () {
      await TechnologicalAnimals.connect(contractOwner).safeMint(
        seller.address,
        "0x0001",
        "ipfs://test"
      );

      await TechnologicalAnimals.connect(seller).setApprovalForAll(
        MarketplaceFundamental.address,
        true
      );

      await MarketplaceFundamental.connect(seller).createSale(
        TechnologicalAnimals.address,
        "0x0001",
        ethers.utils.parseEther("1")
      );

      await MarketplaceFundamental.connect(buyer).buy(
        TechnologicalAnimals.address,
        "0x0001",
        { value: ethers.utils.parseEther("1") }
      );

      expect(
        await MarketplaceFundamental.isTokenForSale(
          TechnologicalAnimals.address,
          "0x0001"
        )
      ).to.equal(false);
    });
  });
});
