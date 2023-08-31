import React from 'react'
import { Modal, ModalOverlay, ModalContent } from '@chakra-ui/react'
import ShadowButton from '../../ShadowButton/ShadowButton'
import ModifySalePopoverContent from '../ModifySalePopoverContent/ModifySalePopoverContent'
import { ModifySaleManagerProps } from '../../../types/props/ModifySaleManagerProps'

import { colors } from '../../../styles/Colors'
import useModifySaleManager from './useModifySaleManager'

export default function ModifySaleManager({
  nft,
  actualPrice,
  onUpdate,
}: ModifySaleManagerProps) {
  const { isOpen, onOpen, onClose } = useModifySaleManager()

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
        <ModalOverlay />

        <ModalContent
          w={{ base: '80vw', md: '60vw' }}
          h={{ base: '70vh', md: '70vh' }}
        >
          <ModifySalePopoverContent
            nft={nft}
            onClose={onClose}
            onSucess={onUpdate}
            actualPrice={actualPrice}
          />
        </ModalContent>
      </Modal>

      <ShadowButton
        label={'Modify Sale'}
        bgColor={`${colors.modifyChakraColor}.500`}
        textColor={'white'}
        shadowColor={colors.modifyShadowColor}
        hoverColor={`${colors.modifyChakraColor}.600`}
        focusColor={`${colors.modifyChakraColor}.600`}
        onClick={onOpen}
      />
    </>
  )
}
