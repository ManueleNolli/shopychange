import React from 'react'
import {
  Box,
  Center,
  Heading,
  Text,
  Image,
  Flex,
  Divider,
  TableContainer,
  Table,
  Tbody,
  Td,
  Tr,
  SimpleGrid,
  Spacer,
} from '@chakra-ui/react'

import NFTOperations from '../../components/NFTOperations/NFTOperations'

import { NFTPageProps } from '../../types/props/NFTPageProps'

import { renderAddress } from '../../utils/SimplifiedAddress/SimplifiedAddress'

import { Attribute } from '../../types/components/Attribute'
import { NFTHistory } from '../../types/components/Events'
import NFTHistoryTable from '../../components/NFTHistoryTable/NFTHistoryTable'
import { Sale } from '../../types/components/Sale'
import { NFT } from '../../types/components/NFT'
import useNFTPage from './useNFTPage'
import QueryContainer from '../../utils/QueryContainer/QueryContainer'

export default function NFTPage({ contractAddress, tokenId }: NFTPageProps) {
  const {
    image,
    nftComplete,
    isNftCompleteFetching,
    isNftCompleteError,
    sale,
    isSaleFetching,
    isSaleError,
    history,
    isHistoryFetching,
    isHistoryError,
    updateAll,
  } = useNFTPage({ contractAddress, tokenId })

  const renderOperations = (
    sale: Sale | null,
    isSaleFetching: boolean,
    isSaleError: boolean,
    nft: NFT,
    owner: string
  ) => {
    return (
      <QueryContainer isLoading={isSaleFetching} isError={isSaleError}>
        <NFTOperations
          nft={nft}
          owner={owner}
          sale={sale}
          onUpdate={updateAll}
        />
      </QueryContainer>
    )
  }

  const renderHistory = (
    history: NFTHistory,
    isHistoryFetching: boolean,
    isHistoryError: boolean
  ) => {
    return (
      <QueryContainer isLoading={isHistoryFetching} isError={isHistoryError}>
        <NFTHistoryTable nftHistory={history} />
      </QueryContainer>
    )
  }

  const renderAttribute = (attribute: Attribute) => {
    return (
      <Flex
        minW={'8vw'}
        minH={'8vh'}
        key={attribute.traitType}
        borderColor={'gray.200'}
        borderWidth={'1px'}
        flexDir={'column'}
        rounded={'lg'}
      >
        <Spacer />
        <Center>
          <Text color={'gray.400'}>{attribute.traitType}</Text>
        </Center>
        <Spacer />
        <Center>
          <Text>{attribute.value}</Text>
        </Center>
        <Spacer />
      </Flex>
    )
  }

  return (
    <Box>
      <QueryContainer
        isLoading={isNftCompleteFetching}
        isError={isNftCompleteError}
      >
        <Center>
          <Flex direction="column">
            <Heading textAlign={'center'}>{nftComplete.nft.name}</Heading>
            <Center>
              <Box
                rounded={'lg'}
                mt={12}
                pos={'relative'}
                height={'50vh'}
                width={'50vh'}
                _after={{
                  transition: 'all .3s ease',
                  content: '""',
                  w: 'full',
                  h: 'full',
                  pos: 'absolute',
                  top: 0,
                  left: 0,
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  filter: 'blur(25px)',
                  zIndex: -1,
                }}
                _hover={{
                  _after: {
                    filter: 'blur(35px)',
                  },
                }}
              >
                <Center mt={'5vh'}>
                  <Image
                    rounded={'lg'}
                    height="40vh"
                    width="40vh"
                    objectFit={'cover'}
                    src={image}
                  />
                </Center>
              </Box>
            </Center>

            <Box my={5}>
              {renderOperations(
                sale,
                isSaleFetching,
                isSaleError,
                nftComplete.nft,
                nftComplete.owner
              )}
            </Box>

            <Center>
              <Box>
                <Flex
                  w={{ base: '80vw', md: '70vw' }}
                  direction={{ base: 'column', xl: 'row' }}
                >
                  <Box my={5} flex="1">
                    <Heading mb={5} textAlign={'center'} size={'md'}>
                      Description
                    </Heading>
                    <Text textAlign={'center'} wordBreak={'break-word'}>
                      {nftComplete.description}
                    </Text>
                  </Box>

                  <Box m={5}>
                    <Divider orientation="vertical" size={'50px'} />
                    <Divider />
                  </Box>

                  <Box my={5} flex="1">
                    <Heading mb={5} textAlign={'center'} size={'md'}>
                      Details
                    </Heading>
                    <TableContainer>
                      <Table variant="unstyled">
                        <Tbody>
                          <Tr>
                            <Td py="2">Contract Address</Td>
                            <Td py="2" textAlign={'end'}>
                              {renderAddress(
                                nftComplete.contract.address,
                                `/${nftComplete.contract.address}`
                              )}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td py="2">Contract Name</Td>
                            <Td py="2" textAlign={'end'}>
                              {nftComplete.contract.name}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td py="2">Contract Symbol</Td>
                            <Td py="2" textAlign={'end'}>
                              {nftComplete.contract.symbol}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td py="2">Token ID</Td>
                            <Td py="2" textAlign={'end'}>
                              {nftComplete.nft.tokenId}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td py="2">Token Type</Td>
                            <Td py="2" textAlign={'end'}>
                              {nftComplete.tokenType}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td py="2">Owner</Td>
                            <Td py="2" textAlign={'end'}>
                              {renderAddress(
                                nftComplete.owner,
                                `/account/${nftComplete.owner}`
                              )}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Flex>
                <Divider my={5} />
                {nftComplete.attributes.length > 0 && (
                  <>
                    <Box>
                      <Heading mb={5} textAlign={'center'} size={'md'}>
                        Attributes
                      </Heading>

                      <SimpleGrid
                        columns={{ sm: 2, md: 3, lg: 4, xl: 5 }}
                        spacing={10}
                      >
                        {nftComplete.attributes.map((attribute) =>
                          renderAttribute(attribute)
                        )}
                      </SimpleGrid>
                    </Box>
                    <Divider my={5} />
                  </>
                )}
                <Box>
                  <Heading mb={5} textAlign={'center'} size={'md'}>
                    History
                  </Heading>
                  {renderHistory(history, isHistoryFetching, isHistoryError)}
                </Box>
              </Box>
            </Center>
          </Flex>
        </Center>
      </QueryContainer>
    </Box>
  )
}
