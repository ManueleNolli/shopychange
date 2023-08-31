import React from 'react'
import { Modal, ModalOverlay, ModalContent } from '@chakra-ui/react'
import ShadowButton from '../../ShadowButton/ShadowButton'
import BuyPopoverContent from '../BuyPopoverContent/BuyPopoverContent'

import { colors } from '../../../styles/Colors'
import { BuyManagerProps } from '../../../types/props/BuyManagerProps'
import useBuyManager from './useBuyManager'

export default function BuyManager({ nft, price, onUpdate }: BuyManagerProps) {
  const { isOpen, onOpen, onClose } = useBuyManager()
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
        <ModalOverlay />

        <ModalContent
          w={{ base: '80vw', md: '60vw' }}
          h={{ base: '60vh', md: '60vh' }}
        >
          <BuyPopoverContent
            nft={nft}
            price={price}
            onClose={onClose}
            onSuccess={onUpdate}
          />
        </ModalContent>
      </Modal>

      <ShadowButton
        label={`Buy for ${price} ETH`}
        bgColor={`${colors.buyChakraColor}.500`}
        textColor={'white'}
        shadowColor={colors.buyShadowColor}
        hoverColor={`${colors.buyChakraColor}.600`}
        focusColor={`${colors.buyChakraColor}.600`}
        onClick={onOpen}
        buttonProps={{
          size: 'lg',
          width: '50%',
          maxW: '20em',
        }}
      />
    </>
  )
}
