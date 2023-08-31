import { NFT } from '../components/NFT'

export type NFTOrCollectionViewerProps = {
  nfts: NFT[]
  nftChildren?: React.ReactNode
  nftChildrenWithProps?: (nft: NFT) => React.ReactNode
  saleButton?: boolean
}
