import { NewNFT } from '../types/components/NewNFT'
import { NFTStorage } from 'nft.storage'

const endpoint = process.env.REACT_APP_IPFS_ENDPOINT
const token = process.env.REACT_APP_IPFS_API_KEY

if (endpoint === undefined || token === undefined) {
  throw new Error('IPFS endpoint or token not defined')
}

const storage = new NFTStorage({
  endpoint: new URL(endpoint),
  token,
})

export const uploadNFT = async ({
  name,
  description,
  image,
  attributes,
}: NewNFT) => {
  const nft = await storage.store({
    name,
    description,
    image,
    attributes,
  })

  return nft.url
}

export const uploadCollection = async (nfts: NewNFT[]) => {
  let images = nfts.map((nft) => nft.image)

  //rename images as number of nfts 0 to n
  images = images.map((image, index) => {
    return new File([image], `${index}.${image.type.split('/')[1]}`, {
      type: image.type,
    })
  })

  const cidImage = await storage.storeDirectory(images)
  const metadata = []
  for (let i = 0; i < nfts.length; i++) {
    const tempMetadata = {
      name: nfts[i].name,
      description: nfts[i].description,
      image: `ipfs://${cidImage}/${i}.${nfts[i].image.type.split('/')[1]}`,
      attributes: nfts[i].attributes,
    }
    const metadataFile = new File([JSON.stringify(tempMetadata)], `${i}`, {
      type: 'application/json',
    })

    metadata.push(metadataFile)
  }
  const cidMetadata = await storage.storeDirectory(metadata)
  return cidMetadata
}
