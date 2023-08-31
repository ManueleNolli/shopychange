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

import { colors } from '../../../styles/Colors'
import { CancelSalePopoverProps } from '../../../types/props/CancelSalePopoverProps'
import useCancelSalePopoverContent from './useCancelSalePopoverContent'

export default function CancelSalePopoverContent({
  nft,
  onClose,
  onSuccess,
}: CancelSalePopoverProps) {
  const { isLoading, cancel } = useCancelSalePopoverContent({
    nft,
    onClose,
    onSuccess,
  })

  return (
    <Flex direction="column" flex="1" p="1vh">
      <Spacer />

      <Container flex="1" centerContent>
        <Heading size="lg" textAlign={'center'}>
          Are you sure you want to cancel the sale of{' '}
          <Text as="i">{nft.name}</Text>?
        </Heading>
      </Container>

      <Center flex="1" mt="5">
        <ButtonGroup spacing="10">
          <LoadingButton isLoading={isLoading} data-testid="loading-button">
            <ShadowButton
              label={'Cancel sale'}
              bgColor={`${colors.sellChakraColor}.400`}
              textColor={'white'}
              shadowColor={colors.sellShadowColor}
              hoverColor={`${colors.sellChakraColor}.500`}
              focusColor={`${colors.sellChakraColor}.500`}
              onClick={cancel}
            />
          </LoadingButton>
          <ShadowButton
            label={'Do not cancel'}
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
