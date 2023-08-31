import { NFT } from '../components/NFT'

export type CancelSalePopoverProps = {
  nft: NFT
  onClose: () => void
  onSuccess: () => void
}
