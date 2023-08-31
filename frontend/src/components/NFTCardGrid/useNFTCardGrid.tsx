import { useNavigate } from 'react-router-dom'
import { NFT } from '../../types/components/NFT'

export default function useNFTCardGrid() {
  const navigate = useNavigate()

  const onNavigation = (nft: NFT) => {
    navigate(`/${nft.contractAddress}/${nft.tokenId}`)
  }

  return {
    onNavigation,
  }
}
