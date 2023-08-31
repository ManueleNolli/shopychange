import { NFT } from './NFT'

export type Sale = {
  nftData: NFT
  seller: string
  price: number
  status: number
}
