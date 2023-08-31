import React from 'react'

import { Box, Center, Heading } from '@chakra-ui/react'

import { AccountAddressPageProps } from '../../types/props/AccountAddressPageProps'
import { simplifiedAddress } from '../../utils/SimplifiedAddress/SimplifiedAddress'
import useAccountAddressPage from './useAccountAddressPage'
import QueryContainer from '../../utils/QueryContainer/QueryContainer'
import NFTOrCollectionViewer from '../../components/NFTOrCollectionViewer/NFTOrCollectionViewer'

export default function AccountAddressPage({
  address,
}: AccountAddressPageProps) {
  const { isFetching, isError, nfts } = useAccountAddressPage(address)

  return (
    <Box>
      <Center>
        <Heading>Account {simplifiedAddress(address)}</Heading>
      </Center>

      <QueryContainer isLoading={isFetching} isError={isError}>
        <Center>
          <NFTOrCollectionViewer nfts={nfts} />
        </Center>
      </QueryContainer>
    </Box>
  )
}
