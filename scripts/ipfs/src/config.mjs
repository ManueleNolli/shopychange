import fs from "fs";

/***************
 * PROJECT SETUP
 ****************/

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
  console.log(process.env.PWD);
}

export const buildDir = `${process.env.PWD}/build`;
export const metadataDir = `${buildDir}/metadata`;
export const imagesDir = `${buildDir}/images`;
export const layersDir = `${process.env.PWD}/layers`;

/****************
 * PERSONAL SETUP
 ****************/

// Layers of design
// Increase number value above real layer file count to create the option and porportions of empty render
const countLayerFiles = (layer) =>
  fs.readdirSync(`${layersDir}/${layer}`).length;

// drawRate - change val to control how often layer is drawn
// name - must match folder name in layers folder
// attention: the order of layers is important
let layers = [
  { name: "background" },
  { name: "planet" },
  { name: "flyingObjects", drawRate: 0.5 },
];

export const layersOrder = layers.map((layer) => ({
  ...layer,
  number: countLayerFiles(layer.name),
}));

// Dimensions of rendered images
export const format = {
  width: 1000,
  height: 1000,
};

// Rarity - change val to control rarity group porportions
// name layer files with key at end
export const rarity = [
  { key: "", val: 16 }, // normal
  { key: "_r", val: 8 }, // rare
  { key: "_sr", val: 2 }, // super rare
];

export const defaultEdition = 5; // Number of editions to generate

export const nftName = "Planet";
export const collectionDescription = "Would you like to live here?";
