import { useDisclosure } from '@chakra-ui/react'

export default function useCancelSaleManager() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return { isOpen, onOpen, onClose }
}
