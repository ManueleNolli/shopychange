import { useDisclosure } from '@chakra-ui/react'

export default function useSellManager() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return { isOpen, onOpen, onClose }
}
