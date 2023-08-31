import { useDisclosure } from '@chakra-ui/react'

export default function useModifySaleManager() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return { isOpen, onOpen, onClose }
}
