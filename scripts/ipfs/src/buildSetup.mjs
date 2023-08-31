import fs from "fs";
import { buildDir, imagesDir, metadataDir } from "./config.mjs";

/**************
 * BUILD SETUP
 *************/
export const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(metadataDir);
  fs.mkdirSync(imagesDir);
};
