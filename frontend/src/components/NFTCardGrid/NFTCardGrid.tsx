import React from 'react'

import { SimpleGrid } from '@chakra-ui/react'
import { NFTCardGridProps } from '../../types/props/NFTCardGridProps'
import NFTCard from '../NFTCard/NFTCard'
import useNFTCardGrid from './useNFTCardGrid'

export default function NFTCardGrid({
  nfts,
  nftChildren,
  nftChildrenWithProps,
  saleButton,
}: NFTCardGridProps) {
  const { onNavigation } = useNFTCardGrid()

  return (
    <SimpleGrid
      pl="5"
      pr="5"
      spacing="5"
      maxW={{ sm: '600px', md: '2500px' }}
      columns={{ sm: 2, md: 3, lg: 4, xl: 5 }}
    >
      {nfts.map((nft) => (
        <NFTCard
          saleButton={saleButton}
          nft={nft}
          key={`${nft.contractAddress}.${nft.tokenId}`}
          onClick={() => onNavigation(nft)}
        >
          {nftChildren && nftChildren}
          {nftChildrenWithProps && nftChildrenWithProps(nft)}
        </NFTCard>
      ))}
    </SimpleGrid>
  )
}
