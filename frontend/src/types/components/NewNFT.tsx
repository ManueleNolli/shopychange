// type for a new NFT to be uploaded to IPFS

export type Attribute = {
  trait_type: string
  value: string
}

export type NewNFT = {
  name: string
  description: string
  image: File
  attributes: Attribute[]
}
