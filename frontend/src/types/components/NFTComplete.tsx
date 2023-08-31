import { Contract } from './Contract'
import { NFT } from './NFT'
import { Attribute } from './Attribute'

export type NFTComplete = {
  nft: NFT
  owner: string
  description: string
  attributes: Attribute[]
  contract: Contract
  tokenType: string
}
