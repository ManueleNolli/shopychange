/*
Copies the artifacts path given from the compiled contracts to the given destination folders.
*/

import fs from "fs";
import path from "path";

export function copyArtifacts(
  artifactsName: string,
  destinationPath: string[],
  additionalPath?: string
) {
  const artifactsPath = path.join(
    __dirname,
    "..",
    "..",
    "artifacts",
    "contracts",
    additionalPath ? additionalPath : "",
    `${artifactsName}.sol`,
    `${artifactsName}.json`
  );

  for (const destination of destinationPath) {
    const fullDestinationPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      destination
    );
    const artifact = fs.readFileSync(artifactsPath);
    if (!fs.existsSync(fullDestinationPath)) {
      fs.mkdirSync(fullDestinationPath);
    }
    fs.writeFileSync(
      path.join(fullDestinationPath, `${artifactsName}.json`),
      artifact
    );
    console.log(`Copied ${artifactsName} to ${fullDestinationPath}`);
  }
}
