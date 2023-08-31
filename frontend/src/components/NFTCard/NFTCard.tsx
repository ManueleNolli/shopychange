import React from 'react'

import {
  Center,
  useColorModeValue,
  Heading,
  Box,
  Image,
} from '@chakra-ui/react'
import { NFTCardProps } from '../../types/props/NFTCardProps'
import SellOrIsForSale from '../Sell/SellOrIsForSale/SellOrIsForSale'
import useNFTCard from './useNFTCard'
import QueryContainer from '../../utils/QueryContainer/QueryContainer'
import LoadingButton from '../LoadingButton/LoadingButton'

export default function NFTCard({
  nft,
  children,
  onClick,
  saleButton = false,
}: NFTCardProps) {
  const { isFetching, isError, image, sale, updateSale } = useNFTCard({
    nft,
    saleButton,
  })

  return (
    <Center py={12}>
      <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        h={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}
      >
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'80%'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(25px)',
            },
          }}
        >
          <Center
            minH={'220px'}
            data-testid={`onclick-button-${nft.contractAddress}-${nft.tokenId}`}
            onClick={onClick}
            _hover={{
              cursor: onClick ? 'pointer' : 'default',
            }}
          >
            <Image
              rounded={'lg'}
              height="80%"
              width="80%"
              objectFit={'cover'}
              src={image}
            />
          </Center>
        </Box>
        <Center pt={{ base: 5, md: 10 }}>
          <Heading fontSize={'xl'} fontFamily={'body'} fontWeight={500}>
            {nft.name}
          </Heading>
        </Center>

        {children}

        {saleButton ? (
          <Center
            pt={5}
            zIndex={1}
            position={'absolute'}
            bottom="-7"
            left="0"
            w="full"
          >
            <LoadingButton isLoading={isFetching} loadingButtonProps={{}}>
              <QueryContainer isError={isError} isLoading={isFetching}>
                <SellOrIsForSale nft={nft} onUpdate={updateSale} sale={sale} />
              </QueryContainer>
            </LoadingButton>
          </Center>
        ) : (
          <></>
        )}
      </Box>
    </Center>
  )
}
