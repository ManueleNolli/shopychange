import { NFT } from '../components/NFT'

export type ModifySalePopoverContentProps = {
  nft: NFT
  onClose: () => void
  onSucess: () => void
  actualPrice: number
}
