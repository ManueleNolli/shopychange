import React from 'react'
import { Box, Button, Center, Text } from '@chakra-ui/react'
import { NFTOrCollectionViewerProps } from '../../types/props/NFTOrCollectionViewerProps'
import NFTCardGrid from '../NFTCardGrid/NFTCardGrid'
import CollectionGrid from '../CollectionGrid/CollectionGrid'

import { MdViewModule } from 'react-icons/md'
import { MdViewList } from 'react-icons/md'
import useNFTOrCollectionViewer from './useNFTOrCollectionViewer'

export default function NFTOrCollectionViewer(
  props: NFTOrCollectionViewerProps
) {
  const { nftsView, setNftsView } = useNFTOrCollectionViewer() // true = NFTs, false = Collections

  const renderNFTs = () => {
    if (props.nfts.length === 0) return
    if (nftsView) {
      return <NFTCardGrid {...props} />
    } else {
      return <CollectionGrid {...props} />
    }
  }

  return (
    <Box mt="2vh" w="100%">
      {props.nfts.length === 0 ? (
        <Box w="full">
          <Center>
            <Text py="10">No NFTs found</Text>
          </Center>
        </Box>
      ) : (
        <Box
          h="5vh"
          w="100%"
          px={5}
          justifyContent={'flex-end'}
          alignItems={'center'}
          display={'flex'}
        >
          <Button isActive={nftsView} onClick={() => setNftsView(true)} mr={2}>
            <MdViewModule
              size={'70%'}
              style={{ marginRight: '2px' }}
              data-testid="button-nfts"
            />
            NFTs
          </Button>
          <Button
            isActive={!nftsView}
            onClick={() => setNftsView(false)}
            ml={2}
          >
            <MdViewList
              size={'60%'}
              style={{ marginRight: '2px' }}
              data-testid="button-collections"
            />
            Collections
          </Button>
        </Box>
      )}

      {renderNFTs()}
    </Box>
  )
}
