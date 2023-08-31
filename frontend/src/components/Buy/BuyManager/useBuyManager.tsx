import { useDisclosure } from '@chakra-ui/react'

export default function useBuyManager() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return { isOpen, onOpen, onClose }
}
