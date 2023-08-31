import { NFT } from '../components/NFT'

export type NFTCardGridProps = {
  nfts: NFT[]
  nftChildren?: React.ReactNode
  nftChildrenWithProps?: (nft: NFT) => React.ReactNode
  saleButton?: boolean
}
