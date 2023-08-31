import { NFT } from '../components/NFT'

export type SellPopoverProps = {
  nft: NFT
  onClose: () => void
  onSucess: () => void
}
