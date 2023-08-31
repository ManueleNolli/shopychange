import React from 'react'

import {
  Flex,
  Center,
  ButtonGroup,
  Heading,
  Text,
  Spacer,
  Container,
  NumberInput,
  NumberInputField,
  ModalContent,
} from '@chakra-ui/react'

import LoadingButton from '../../LoadingButton/LoadingButton'
import ShadowButton from '../../ShadowButton/ShadowButton'

import { SellPopoverProps } from '../../../types/props/SellPopoverProps'

import { colors } from '../../../styles/Colors'
import PriceDistrubution from '../../PriceDistribition/PriceDistribution'
import useSellPopoverContent from './useSellPopoverContent'
import QueryContainer from '../../../utils/QueryContainer/QueryContainer'

export default function SellPopoverContent({
  nft,
  onClose,
  onSucess,
}: SellPopoverProps) {
  const {
    isApproved,
    isLoading,
    price,
    setPrice,
    approve,
    sell,
    isFetching,
    isError,
  } = useSellPopoverContent({
    nft,
    onClose,
    onSucess,
  })

  return (
    <ModalContent
      w={{ base: '80vw', md: '60vw' }}
      h={isApproved ? '60vh' : '30vh'}
    >
      <QueryContainer isLoading={isFetching} isError={isError}>
        <Flex direction="column" flex="1" p="1vh">
          <Spacer />

          <Container flex="1" centerContent>
            <Heading size="lg" textAlign={'center'}>
              Are you sure you want to sell <Text as="i">{nft.name}</Text>?
            </Heading>
          </Container>

          {isApproved ? (
            <>
              <Spacer />
              <Center>
                <NumberInput
                  defaultValue={0}
                  min={0}
                  step={0.01}
                  onChange={(value) => setPrice(parseFloat(value))}
                >
                  <NumberInputField
                    textAlign="center"
                    data-testid="price-input"
                  />
                </NumberInput>
                <Text pl="2" color={'gray.500'}>
                  eth
                </Text>
              </Center>
              <Spacer />
              <PriceDistrubution
                price={price}
                isOwner={true}
                address={nft.contractAddress}
                tokenId={nft.tokenId}
              />
            </>
          ) : null}

          <Spacer />

          <Center flex="1" mt="5">
            <ButtonGroup spacing="10">
              <LoadingButton isLoading={isLoading} data-testid="loading-button">
                {isApproved ? (
                  <ShadowButton
                    label={'Sell'}
                    bgColor={`${colors.sellChakraColor}.400`}
                    textColor={'white'}
                    shadowColor={colors.sellShadowColor}
                    hoverColor={`${colors.sellChakraColor}.500`}
                    focusColor={`${colors.sellChakraColor}.500`}
                    onClick={sell}
                  />
                ) : (
                  <ShadowButton
                    label={'Approve'}
                    bgColor={`${colors.approveChakraColor}.400`}
                    textColor={'white'}
                    shadowColor={colors.approveShadowColor}
                    hoverColor={`${colors.approveChakraColor}.500`}
                    focusColor={`${colors.approveChakraColor}.500`}
                    onClick={approve}
                  />
                )}
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
      </QueryContainer>
    </ModalContent>
  )
}
