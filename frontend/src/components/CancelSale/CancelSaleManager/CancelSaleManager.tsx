import React from 'react'
import { Modal, ModalOverlay, ModalContent } from '@chakra-ui/react'
import ShadowButton from '../../ShadowButton/ShadowButton'
import CancelPopoverContent from '../CancelSalePopoverContent/CancelSalePopoverContent'

import { CancelSaleManagerProps } from '../../../types/props/CancelSaleManagerProps'

import { colors } from '../../../styles/Colors'
import useCancelSaleManager from './useCancelSaleManager'

export default function CancelSaleManager({
  nft,
  onUpdate,
}: CancelSaleManagerProps) {
  const { isOpen, onOpen, onClose } = useCancelSaleManager()

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
        <ModalOverlay />

        <ModalContent
          w={{ base: '80vw', md: '60vw' }}
          h={{ base: '30vh', md: '30vh' }}
        >
          <CancelPopoverContent
            nft={nft}
            onClose={onClose}
            onSuccess={onUpdate}
          />
        </ModalContent>
      </Modal>

      <ShadowButton
        label={'Cancel Sale'}
        bgColor={`${colors.cancelChakraColor}.500`}
        textColor={'white'}
        shadowColor={colors.cancelShadowColor}
        hoverColor={`${colors.cancelChakraColor}.600`}
        focusColor={`${colors.cancelChakraColor}.600`}
        onClick={onOpen}
      />
    </>
  )
}
