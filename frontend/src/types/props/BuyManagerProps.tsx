import { NFT } from '../components/NFT'

export type BuyManagerProps = {
  nft: NFT
  price: number
  onUpdate: () => void
}
