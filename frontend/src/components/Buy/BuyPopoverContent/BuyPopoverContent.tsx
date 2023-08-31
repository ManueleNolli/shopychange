import React from 'react'

import {
  Flex,
  Center,
  ButtonGroup,
  Heading,
  Text,
  Spacer,
  Container,
} from '@chakra-ui/react'

import LoadingButton from '../../LoadingButton/LoadingButton'
import ShadowButton from '../../ShadowButton/ShadowButton'
import PriceDistrubution from '../../PriceDistribition/PriceDistribution'

import { colors } from '../../../styles/Colors'

import { BuyPopoverProps } from '../../../types/props/BuyPopoverContentProps'
import useBuyPopoverContent from './useBuyPopoverContent'

export default function CancelSalePopoverContent({
  nft,
  price,
  onClose,
  onSuccess,
}: BuyPopoverProps) {
  const { isLoading, buyToken } = useBuyPopoverContent({
    nft,
    price,
    onClose,
    onSuccess,
  })

  return (
    <Flex direction="column" flex="1" p="1vh">
      <Spacer />

      <Container flex="1" centerContent>
        <Heading size="lg" textAlign={'center'}>
          Are you sure you want to buy <Text as="i">{nft.name}</Text>?
        </Heading>
      </Container>

      <Spacer />
      <PriceDistrubution
        price={price}
        isOwner={false}
        address={nft.contractAddress}
        tokenId={nft.tokenId}
      />
      <Spacer />

      <Center flex="1" mt="5">
        <ButtonGroup spacing="10">
          <LoadingButton isLoading={isLoading} data-testid="loading-button">
            <ShadowButton
              data-testid="buy-button"
              label={`Buy for ${price} ETH`}
              bgColor={`${colors.buyChakraColor}.500`}
              textColor={'white'}
              shadowColor={colors.buyShadowColor}
              hoverColor={`${colors.buyChakraColor}.600`}
              focusColor={`${colors.buyChakraColor}.600`}
              onClick={buyToken}
            />
          </LoadingButton>
          <ShadowButton
            label={'Cancel'}
            bgColor={`${colors.cancelChakraColor}.500`}
            textColor={'white'}
            shadowColor={colors.cancelShadowColor}
            hoverColor={`${colors.cancelChakraColor}.600`}
            focusColor={`${colors.cancelChakraColor}.600`}
            onClick={onClose}
          />
        </ButtonGroup>
      </Center>
      <Spacer />
    </Flex>
  )
}
