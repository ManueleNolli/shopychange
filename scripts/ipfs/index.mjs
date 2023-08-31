import "dotenv/config";

import { defaultEdition } from "./src/config.mjs";
import { buildSetup } from "./src/buildSetup.mjs";
import { createFiles } from "./src/createNFTs.mjs";
import { uploadToIPFS } from "./src/uploadToIPFS.mjs";

const args = process.argv.slice(2);
const edition = args[1] > 0 ? args[1] : defaultEdition;

const main = () => {
  if (args[0] === "create") {
    buildSetup();
    createFiles(edition);
  } else if (args[0] === "upload") {
    uploadToIPFS();
  } else {
    console.warn("Please enter a valid command");
    console.warn("npm run start create: generate NFTs");
    console.warn("npm run start upload: upload NFTs to IPFS");
  }
};

main();
