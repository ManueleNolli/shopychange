const { ethers } = require("hardhat");
const { expect } = require("chai");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";

describe("MarketplaceEarnable", function () {
  let contractOwner: SignerWithAddress;
  let other: SignerWithAddress;
  let other2: SignerWithAddress;
  let MarketplaceEarnable: Contract;
  let otherContract: Contract;

  beforeEach(async function () {
    [contractOwner, other, other2] = await ethers.getSigners();
    const MarketplaceEarnableFactory = await ethers.getContractFactory(
      "MarketplaceEarnable"
    );
    MarketplaceEarnable = await MarketplaceEarnableFactory.connect(
      contractOwner
    ).deploy(100); // Start with 1% royalty
    await MarketplaceEarnable.deployed();

    // Send 1 ETH to the contract
    await contractOwner.sendTransaction({
      to: MarketplaceEarnable.address,
      value: ethers.utils.parseEther("1"),
    });

    // Deploy a contract that will receive the royalties
    const TechnologicalAnimalsFactory = await ethers.getContractFactory(
      "TechnologicalAnimals"
    );
    otherContract = await TechnologicalAnimalsFactory.connect(
      contractOwner
    ).deploy();
    await otherContract.deployed();
  });

  describe("Withdraw", function () {
    it("Should withdraw all the balance", async function () {
      const balanceBefore = await ethers.provider.getBalance(
        contractOwner.address
      );
      await MarketplaceEarnable.connect(contractOwner).withdraw();
      const balanceAfter = await ethers.provider.getBalance(
        contractOwner.address
      );
      const ContractBalanceAfter = await ethers.provider.getBalance(
        MarketplaceEarnable.address
      );
      expect(balanceAfter).to.be.gt(balanceBefore);
      expect(ContractBalanceAfter).to.be.equal(0);
    });

    it("Should revert if not the owner", async function () {
      await expect(
        MarketplaceEarnable.connect(other).withdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if the balance is 0", async function () {
      await MarketplaceEarnable.connect(contractOwner).withdraw();
      await expect(
        MarketplaceEarnable.connect(contractOwner).withdraw()
      ).to.be.revertedWith("No balance to withdraw");
    });
  });

  describe("WithdrawTo", function () {
    it("Should withdraw all the balance", async function () {
      const balanceBefore = await ethers.provider.getBalance(other.address);
      await MarketplaceEarnable.connect(contractOwner).withdrawTo(
        other.address
      );
      const balanceAfter = await ethers.provider.getBalance(other.address);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("Should revert if not the owner", async function () {
      await expect(
        MarketplaceEarnable.connect(other).withdrawTo(other.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if the balance is 0", async function () {
      await MarketplaceEarnable.connect(contractOwner).withdrawTo(
        other.address
      );
      await expect(
        MarketplaceEarnable.connect(contractOwner).withdrawTo(other.address)
      ).to.be.revertedWith("No balance to withdraw");
    });
    it("Should revert if the address is a contract", async function () {
      await expect(
        MarketplaceEarnable.connect(contractOwner).withdrawTo(
          otherContract.address
        )
      ).to.be.revertedWith("Can't withdraw to contract");
    });

    it("Should revert if the address is a EOA not valid", async function () {
      await expect(
        MarketplaceEarnable.connect(contractOwner).withdrawTo(
          "0x0000000000000000000000000000000000000001"
        )
      ).to.be.revertedWith("The address can't receive ETH");
    });
  });

  describe("WithdrawToAmout", function () {
    it("Should withdraw an amount", async function () {
      const balanceBefore = await ethers.provider.getBalance(other.address);
      await MarketplaceEarnable.connect(contractOwner).withdrawToAmount(
        other.address,
        ethers.utils.parseEther("0.1")
      );
      const balanceAfter = await ethers.provider.getBalance(other.address);
      const balanceExpected = balanceBefore.add(ethers.utils.parseEther("0.1"));
      expect(balanceAfter).to.be.equal(balanceExpected);
    });

    it("Should revert if not the owner", async function () {
      await expect(
        MarketplaceEarnable.connect(other).withdrawToAmount(
          other.address,
          ethers.utils.parseEther("0.1")
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if the balance is 0", async function () {
      await MarketplaceEarnable.connect(contractOwner).withdrawToAmount(
        other.address,
        ethers.utils.parseEther("1.0")
      );
      await expect(
        MarketplaceEarnable.connect(contractOwner).withdrawToAmount(
          other.address,
          ethers.utils.parseEther("0.1")
        )
      ).to.be.revertedWith("No balance to withdraw");
    });

    it("Should revert if the amount is greater than the balance", async function () {
      await expect(
        MarketplaceEarnable.connect(contractOwner).withdrawToAmount(
          other.address,
          ethers.utils.parseEther("1.1")
        )
      ).to.be.revertedWith("Amount is bigger than balance");
    });

    it("Should revert if the address is a contract", async function () {
      await expect(
        MarketplaceEarnable.connect(contractOwner).withdrawToAmount(
          otherContract.address,
          ethers.utils.parseEther("0.1")
        )
      ).to.be.revertedWith("Can't withdraw to contract");
    });

    it("Should revert if the address is a EOA not valid", async function () {
      await expect(
        MarketplaceEarnable.connect(contractOwner).withdrawToAmount(
          "0x0000000000000000000000000000000000000001",
          ethers.utils.parseEther("0.1")
        )
      ).to.be.revertedWith("The address can't receive ETH");
    });
  });

  describe("setMarketplaceRoyalty", function () {
    it("Should set the royalty", async function () {
      await MarketplaceEarnable.connect(contractOwner).setMarketplaceRoyalty(
        50
      );
      expect(await MarketplaceEarnable.getMarketplaceRoyalty()).to.be.equal(50);
    });

    it("Should revert if not the owner", async function () {
      await expect(
        MarketplaceEarnable.connect(other).setMarketplaceRoyalty(50)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if the royalty is greater than 100%", async function () {
      await expect(
        MarketplaceEarnable.connect(contractOwner).setMarketplaceRoyalty(10001)
      ).to.be.revertedWith("Royalty can't be greater than 100%");
    });
  });

  describe("getRoyaltyForSale", function () {
    it("Should return the royalty", async function () {
      const result = await MarketplaceEarnable.connect(other).getRoyaltyForSale(
        100 // 100 eth
      );
      expect(result).to.be.equal(1); // 1 eth
    });
  });

  describe("Buy", function () {
    it("Shoud catch the royalty", async function () {
      await otherContract
        .connect(contractOwner)
        .safeMint(other.address, "0x0001", "ipfs://test");

      await otherContract
        .connect(other)
        .approve(MarketplaceEarnable.address, "0x0001");

      await MarketplaceEarnable.connect(other).createSale(
        otherContract.address,
        "0x0001",
        ethers.utils.parseEther("1.0")
      );

      const sales = await MarketplaceEarnable.getSales();
      expect(sales.length).to.equal(1);

      const otherBalanceBefore = await ethers.provider.getBalance(
        other.address
      );
      const marketplaceBalanceBefore = await ethers.provider.getBalance(
        MarketplaceEarnable.address
      );
      const other2BalanceBefore = await ethers.provider.getBalance(
        other2.address
      );

      // Buy
      await MarketplaceEarnable.connect(other2).buy(
        otherContract.address,
        "0x0001",
        {
          value: ethers.utils.parseEther("1.0"),
        }
      );

      const otherBalanceAfter = await ethers.provider.getBalance(other.address);
      const marketplaceBalanceAfter = await ethers.provider.getBalance(
        MarketplaceEarnable.address
      );
      const other2BalanceAfter = await ethers.provider.getBalance(
        other2.address
      );

      // 1% royalty = 0.01 eth
      // 99% to the seller = 0.99 eth

      expect(otherBalanceAfter).to.be.equal(
        otherBalanceBefore.add(ethers.utils.parseEther("0.99"))
      );
      expect(marketplaceBalanceAfter).to.be.equal(
        marketplaceBalanceBefore.add(ethers.utils.parseEther("0.01"))
      );

      expect(other2BalanceAfter).to.be.lessThan(
        other2BalanceBefore.sub(ethers.utils.parseEther("0.99"))
      );
    });
  });
});
