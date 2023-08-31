import { Contract } from './Contract'
import { NFT } from './NFT'

export type Collection = {
  contract: Contract
  nfts: NFT[]
}
