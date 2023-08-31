import React from 'react'
import { Box, Center, Heading, Text } from '@chakra-ui/react'
import NFTOrCollectionViewer from '../../components/NFTOrCollectionViewer/NFTOrCollectionViewer'
import QueryContainer from '../../utils/QueryContainer/QueryContainer'
import useHome from './useHome'

export default function Home() {
  const { sales, isFetching, isError, isConnected } = useHome()

  return (
    <Box>
      <Center>
        <Heading>Market</Heading>
      </Center>
      {isConnected ? (
        <QueryContainer isLoading={isFetching} isError={isError}>
          <Center>
            <NFTOrCollectionViewer nfts={sales} />
          </Center>
        </QueryContainer>
      ) : (
        <Center>
          <Text mt="10">Please connect your wallet to view the market</Text>
        </Center>
      )}
    </Box>
  )
}
