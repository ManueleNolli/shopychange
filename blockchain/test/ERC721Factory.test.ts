const { ethers } = require("hardhat");
const { expect } = require("chai");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";

describe("ShopychangeERC721Factory", function () {
  let other: SignerWithAddress;
  let other2: SignerWithAddress;
  let ShopychangeERC721Factory: Contract;

  beforeEach(async function () {
    const ShopychangeERC721FactoryFactory = await ethers.getContractFactory(
      "ShopychangeERC721Factory"
    );
    ShopychangeERC721Factory = await ShopychangeERC721FactoryFactory.deploy();
    await ShopychangeERC721Factory.deployed();

    [other, other2] = await ethers.getSigners();
  });

  describe("Create new contract", function () {
    it("Should create new contract with correct name", async function () {
      const tx = await ShopychangeERC721Factory.connect(other).createERC721(
        "ShopychangeERC721",
        "S721",
        "ipfs://test/",
        5,
        [],
        []
      );
      const receipt = await tx.wait();
      const contractAddress = receipt.events.find(
        (x: any) => x.event === "NewERC721"
      ).args[1];

      const ERC721contract = await ethers.getContractFactory(
        "BoilerplateERC721"
      );
      const ERC721 = await ERC721contract.attach(contractAddress);

      expect(await ERC721.name()).to.equal("ShopychangeERC721");

      expect(await ERC721.tokenURI(0)).to.equal("ipfs://test/0");
      expect(await ERC721.tokenURI(1)).to.equal("ipfs://test/1");
      expect(await ERC721.tokenURI(2)).to.equal("ipfs://test/2");
      expect(await ERC721.tokenURI(3)).to.equal("ipfs://test/3");
      expect(await ERC721.tokenURI(4)).to.equal("ipfs://test/4");
    });

    it("Should create new contract with correct symbol", async function () {
      const tx = await ShopychangeERC721Factory.connect(other).createERC721(
        "ShopychangeERC721",
        "S721",
        "ipfs://test/",
        5,
        [],
        []
      );
      const receipt = await tx.wait();
      const contractAddress = receipt.events.find(
        (x: any) => x.event === "NewERC721"
      ).args[1];

      const ERC721contract = await ethers.getContractFactory(
        "BoilerplateERC721"
      );
      const ERC721 = await ERC721contract.attach(contractAddress);

      expect(await ERC721.symbol()).to.equal("S721");
    });

    it("Should create new contract and set correct owner", async function () {
      const tx = await ShopychangeERC721Factory.connect(other).createERC721(
        "ShopychangeERC721",
        "S721",
        "ipfs://test/",
        5,
        [],
        []
      );
      const receipt = await tx.wait();
      const contractAddress = receipt.events.find(
        (x: any) => x.event === "NewERC721"
      ).args[1];

      const ERC721contract = await ethers.getContractFactory(
        "BoilerplateERC721"
      );
      const ERC721 = await ERC721contract.attach(contractAddress);

      expect(await ERC721.owner()).to.equal(other.address);
    });

    it("Should create new contract and mint correct number of token", async function () {
      const tx = await ShopychangeERC721Factory.connect(other).createERC721(
        "ShopychangeERC721",
        "S721",
        "ipfs://test/",
        5,
        [],
        []
      );
      const receipt = await tx.wait();
      const contractAddress = receipt.events.find(
        (x: any) => x.event === "NewERC721"
      ).args[1];

      const ERC721contract = await ethers.getContractFactory(
        "BoilerplateERC721"
      );
      const ERC721 = await ERC721contract.attach(contractAddress);

      expect(await ERC721.balanceOf(other.address)).to.equal(5);
      for (let i = 0; i < 4; i++) {
        expect(await ERC721.tokenURI(i)).to.equal("ipfs://test/" + i);
      }
    });
  });

  describe("Getter", function () {
    it("Should return all contracts", async function () {
      const tx1 = await ShopychangeERC721Factory.connect(other).createERC721(
        "ShopychangeERC721",
        "S721",
        "ipfs://test/",
        5,
        [],
        []
      );
      const receipt1 = await tx1.wait();
      const contractAddress1 = receipt1.events.find(
        (x: any) => x.event === "NewERC721"
      ).args[1];

      const userContracts = await ShopychangeERC721Factory.getAllERC721s();
      expect(userContracts.length).to.equal(1);
      expect(userContracts[0]).to.equal(contractAddress1);

      const tx2 = await ShopychangeERC721Factory.connect(other2).createERC721(
        "ShopychangeERC721",
        "S721",
        "ipfs://test/",
        5,
        [],
        []
      );
      const receipt2 = await tx2.wait();
      const contractAddress2 = receipt2.events.find(
        (x: any) => x.event === "NewERC721"
      ).args[1];

      const userContracts2 = await ShopychangeERC721Factory.getAllERC721s();
      expect(userContracts2.length).to.equal(2);
      expect(userContracts2[0]).to.equal(contractAddress1);
      expect(userContracts2[1]).to.equal(contractAddress2);
    });

    describe("Set royalties", function () {
      it("Should set correct royalties", async function () {
        const tx = await ShopychangeERC721Factory.connect(other).createERC721(
          "ShopychangeERC721",
          "S721",
          "ipfs://test/",
          5,
          [other.address],
          [100]
        );
        const receipt = await tx.wait();
        const contractAddress = receipt.events.find(
          (x: any) => x.event === "NewERC721"
        ).args[1];

        const ERC721contract = await ethers.getContractFactory(
          "BoilerplateERC721"
        );
        const ERC721 = await ERC721contract.attach(contractAddress);

        const royalty = await ERC721.royaltyInfo(0, 100);
        expect(royalty[0]).to.equal(other.address);
        expect(royalty[1]).to.equal(ethers.BigNumber.from(1));
      });
    });
  });
});
