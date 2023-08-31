import { useColorModeValue } from '@chakra-ui/react'

export default function useAccountPopover() {
  const popoverContentBgColor = useColorModeValue('white', 'gray.800')

  return { popoverContentBgColor }
}
