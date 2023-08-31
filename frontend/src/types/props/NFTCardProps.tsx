import { NFT } from '../components/NFT'

export type NFTCardProps = {
  nft: NFT
  children?: React.ReactNode
  onClick?: () => void
  saleButton?: boolean
}
