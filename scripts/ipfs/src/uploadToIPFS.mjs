import fs from "fs";
import { metadataDir, imagesDir } from "./config.mjs";
import { NFTStorage, File } from "nft.storage";

const endpoint = "https://api.nft.storage"; // the default
const storage = new NFTStorage({
  endpoint,
  token: process.env.NFT_STORAGE_API,
});

const uploadImages = async () => {
  const imagesName = fs.readdirSync(imagesDir);
  const images = [];
  for (const image of imagesName) {
    const imageFile = new File(
      [await fs.promises.readFile(`${imagesDir}/${image}`)],
      image.split(".")[0],
      {
        type: "image/png",
      }
    );
    images.push(imageFile);
  }
  const cid = await storage.storeDirectory(images);
  return cid;
};

const uploadMetadata = async (cidImages) => {
  const metadataName = fs.readdirSync(metadataDir);
  const metadata = [];
  for (const file of metadataName) {
    const fileContent = JSON.parse(
      fs.readFileSync(`${metadataDir}/${file}`, "utf8")
    );

    const nft = {
      name: fileContent.name,
      description: fileContent.description,
      image: `ipfs://${cidImages}/${fileContent.image.split(".")[0]}`,
      attributes: fileContent.attributes,
    };

    const nftFile = new File(
      [JSON.stringify(nft, null, 2)],
      file.split(".")[0],
      {
        type: "application/json",
      }
    );
    metadata.push(nftFile);
  }

  const cidMetadata = await storage.storeDirectory(metadata);
  return cidMetadata;
};

export const uploadToIPFS = async () => {
  const ImageCid = await uploadImages();
  const metadataCid = await uploadMetadata(ImageCid);
  console.log("Image CID", ImageCid);
  console.log("Metadata CID", metadataCid);
  console.log("-------------------");
  console.log("formatted image cid", `ipfs://${ImageCid}`);
  console.log("formatted metadata cid", `ipfs://${metadataCid}`);
  console.log("-------------------");
  console.log("Link image cid", `https://ipfs.io/ipfs/${ImageCid}`);
  console.log("Link metadata cid", `https://ipfs.io/ipfs/${metadataCid}`);
};
