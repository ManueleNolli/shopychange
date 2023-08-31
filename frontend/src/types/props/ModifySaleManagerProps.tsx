import { NFT } from '../components/NFT'

export type ModifySaleManagerProps = {
  nft: NFT
  actualPrice: number
  onUpdate: () => void
}
