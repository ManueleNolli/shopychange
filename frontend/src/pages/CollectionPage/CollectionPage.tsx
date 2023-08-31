import React from 'react'

import { Box, Center, Heading, Flex } from '@chakra-ui/react'
import NFTCardGrid from '../../components/NFTCardGrid/NFTCardGrid'
import { CollectionPageProps } from '../../types/props/CollectionPageProps'
import CollectionOwnerCheck from '../../utils/CollectionOwnerCheck/CollectionOwnerCheck'
import ShadowButton from '../../components/ShadowButton/ShadowButton'
import { colors } from '../../styles/Colors'
import WithdrawRoyaltyButton from '../../components/WithdrawRoyaltyButton/WithdrawRoyaltyButton'
import useCollectionPage from './useCollectionPage'
import QueryContainer from '../../utils/QueryContainer/QueryContainer'

export default function CollectionPage({
  contractAddress,
}: CollectionPageProps) {
  const { isFetching, isError, collection, onNavigate } =
    useCollectionPage(contractAddress)

  return (
    <Box>
      <QueryContainer isLoading={isFetching} isError={isError}>
        <Center>
          <Flex direction="column">
            <Heading textAlign={'center'}>{collection.contract.name}</Heading>
            <Center my="2vh">
              <CollectionOwnerCheck
                collectionAddress={contractAddress}
                redirectHome={false}
              >
                <ShadowButton
                  label={'Edit Collection Royalties'}
                  bgColor={`${colors.primaryChakraColor}.400`}
                  textColor={'white'}
                  shadowColor={colors.primaryShadowColor}
                  hoverColor={`${colors.primaryChakraColor}.500`}
                  focusColor={`${colors.primaryChakraColor}.500`}
                  buttonProps={{
                    w: { base: '60vw', md: '40vw', lg: '20vw' },
                    maxW: '20em',
                    mr: '2vw',
                  }}
                  onClick={onNavigate}
                />
              </CollectionOwnerCheck>
              <WithdrawRoyaltyButton collectionAddress={contractAddress} />
            </Center>

            <NFTCardGrid nfts={collection.nfts} />
          </Flex>
        </Center>
      </QueryContainer>
    </Box>
  )
}
