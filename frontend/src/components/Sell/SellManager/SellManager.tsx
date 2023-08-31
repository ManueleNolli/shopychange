import React from 'react'
import { useDisclosure, Modal, ModalOverlay } from '@chakra-ui/react'
import SellPopoverContent from '../SellPopoverContent/SellPopoverContent'
import { SellManagerProps } from '../../../types/props/SellManagerProps'
import { colors } from '../../../styles/Colors'
import ShadowButton from '../../ShadowButton/ShadowButton'

export default function SellManager({ nft, onUpdate }: SellManagerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
        <ModalOverlay />

        <SellPopoverContent nft={nft} onClose={onClose} onSucess={onUpdate} />
      </Modal>

      <ShadowButton
        label={'Sell'}
        bgColor={`${colors.sellChakraColor}.400`}
        textColor={'white'}
        shadowColor={colors.sellShadowColor}
        hoverColor={`${colors.sellChakraColor}.500`}
        focusColor={`${colors.sellChakraColor}.500`}
        onClick={onOpen}
      />
    </>
  )
}
