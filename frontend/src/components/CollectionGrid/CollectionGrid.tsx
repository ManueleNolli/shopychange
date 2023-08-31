import React from 'react'
import { Box, Link, Divider, Heading } from '@chakra-ui/react'
import { CollectionGridProps } from '../../types/props/CollectionGridProps'
import NFTCardGrid from '../NFTCardGrid/NFTCardGrid'
import { Link as LinkRouter } from 'react-router-dom'
import useCollectionGrid from './useCollectionGrid'
import QueryContainer from '../../utils/QueryContainer/QueryContainer'

export default function CollectionGrid({
  nfts,
  nftChildren,
  nftChildrenWithProps,
  saleButton,
}: CollectionGridProps) {
  const { isFetching, isError, collections } = useCollectionGrid({
    nfts,
  })

  return (
    <QueryContainer isLoading={isFetching} isError={isError}>
      {collections.map((collection) => (
        <Box key={collection.contract.address} m={4}>
          <Link as={LinkRouter} to={'/' + collection.contract.address}>
            <Heading size="md">{collection.contract.name}</Heading>
          </Link>

          <NFTCardGrid
            nfts={collection.nfts}
            nftChildrenWithProps={nftChildrenWithProps}
            nftChildren={nftChildren}
            saleButton={saleButton}
          />
          {/* divider is not needed for the last collection */}
          {collection !== collections[collections.length - 1] && <Divider />}
        </Box>
      ))}
    </QueryContainer>
  )
}
