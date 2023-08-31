import { NFT } from '../components/NFT'
import { Sale } from '../components/Sale'

export type NFTOperationsProps = {
  nft: NFT
  sale: Sale | null
  owner: string
  onUpdate: () => void
}
