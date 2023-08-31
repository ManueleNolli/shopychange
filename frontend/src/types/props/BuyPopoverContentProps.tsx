import { NFT } from '../components/NFT'

export type BuyPopoverProps = {
  nft: NFT
  price: number
  onClose: () => void
  onSuccess: () => void
}
