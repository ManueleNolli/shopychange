import fs from "fs";
import { createCanvas, loadImage } from "canvas";
import {
  buildDir,
  imagesDir,
  metadataDir,
  layersDir,
  format,
  layersOrder,
  rarity,
  nftName,
  collectionDescription,
  defaultEdition,
} from "./config.mjs";

/*******
 * DATA
 ******/
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
let attributes = [];
let hash = [];
const Exists = new Map();

/*******************
 * UTILITY FUNCTIONS
 ******************/
const addRarity = (_str) => {
  let itemRarity;

  rarity.forEach((r) => {
    if (_str.includes(r.key)) {
      itemRarity = r.val;
    }
  });

  return itemRarity;
};

const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  rarity.forEach((r) => {
    name = name.replace(r.key, "");
  });
  return name;
};

const getElements = (path) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index + 1,
        name: cleanName(i),
        fileName: i,
        rarity: addRarity(i),
      };
    });
};

const layersSetup = (layersOrder) => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    location: `${layersDir}/${layerObj.name}/`,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    position: { x: 0, y: 0 },
    size: { width: format.width, height: format.height },
    number: layerObj.number,
    drawRate: layerObj.drawRate,
  }));

  return layers;
};

const saveLayer = (_canvas, _edition) => {
  fs.writeFileSync(
    `${imagesDir}/${_edition}.png`,
    _canvas.toBuffer("image/png")
  );
};

const addAttributes = (_element, _layer) => {
  let tempAttr = {
    trait_type: _layer.name,
    value: _element.name,
  };
  attributes.push(tempAttr);
  hash.push(_layer.id);
  hash.push(_element.id);
};

const drawLayer = async (_layer, _edition) => {
  const rand = Math.random();

  // dup elements across array according to rarity
  let weightedElementArray = _layer.elements
    .map((element) => {
      let elementArray = new Array(element.rarity).fill(element);
      return elementArray;
    })
    .flat();

  if (!!_layer.drawRate && _layer.drawRate !== 1) {
    // Posibility of empty - add empties to array
    let nonRenderMultiplier = Math.round(1 / _layer.drawRate);
    weightedElementArray = [
      ...weightedElementArray,
      ...new Array(
        Math.round(nonRenderMultiplier * weightedElementArray.length)
      ),
    ];
  }

  let weightedNumber = weightedElementArray.length;

  let element = weightedElementArray[Math.floor(rand * weightedNumber)]
    ? weightedElementArray[Math.floor(rand * weightedNumber)]
    : null;

  if (element) {
    addAttributes(element, _layer);
    const image = await loadImage(`${_layer.location}${element.fileName}`);

    ctx.drawImage(
      image,
      _layer.position.x,
      _layer.position.y,
      _layer.size.width,
      _layer.size.height
    );
    saveLayer(canvas, _edition);
  }
};

const createMetaData = (_edition) => {
  let tempMetadata = {
    name: `${nftName} #${_edition}`,
    description: collectionDescription,
    image: `${_edition}.png`,
    attributes: attributes,
  };
  attributes = [];
  hash = [];

  fs.writeFileSync(
    `${metadataDir}/${_edition}.json`,
    JSON.stringify(tempMetadata, null, 2)
  );
};

/***************
 * MAIN FUNCTION
 **************/
export const createFiles = async (edition) => {
  const layers = layersSetup(layersOrder);

  let numDupes = 0;
  for (let i = 0; i < edition; i++) {
    await layers.forEach(async (layer) => {
      await drawLayer(layer, i);
    });

    let key = hash.toString();
    if (Exists.has(key)) {
      console.log(
        `Duplicate creation for edition ${i}. Same as edition ${Exists.get(
          key
        )}`
      );
      attributes = [];
      numDupes++;
      if (numDupes > edition) break; //prevents infinite loop if no more unique items can be created
      i--;
    } else {
      Exists.set(key, i);
      createMetaData(i);
      console.log("Creating edition " + i);
    }
  }
};
