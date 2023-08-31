import React from 'react'

import { Box, Center, Text } from '@chakra-ui/react'
import NFTOrCollectionViewer from '../../../components/NFTOrCollectionViewer/NFTOrCollectionViewer'
import ShadowButton from '../../../components/ShadowButton/ShadowButton'
import { colors } from '../../../styles/Colors'
import useMyNFTs from './useMyNFTs'
import QueryContainer from '../../../utils/QueryContainer/QueryContainer'

export default function MyNFTs() {
  const { ownedNfts, isFetching, isError, onNavigateToObservedCollections } =
    useMyNFTs()

  return (
    <Box>
      <QueryContainer isLoading={isFetching} isError={isError}>
        <Center flexDir="column">
          <NFTOrCollectionViewer nfts={ownedNfts} saleButton={true} />
        </Center>
        <Center flexDir="column" mt="2vh">
          <Text mb="1vh">Do not see your NFTs?</Text>
          <ShadowButton
            label={'Manage observed Collection'}
            bgColor={`${colors.primaryChakraColor}.400`}
            textColor={'white'}
            shadowColor={colors.primaryShadowColor}
            hoverColor={`${colors.primaryChakraColor}.500`}
            focusColor={`${colors.primaryChakraColor}.500`}
            onClick={onNavigateToObservedCollections}
          />
        </Center>
      </QueryContainer>
    </Box>
  )
}
