import { useDisclosure, useMediaQuery, useColorMode } from '@chakra-ui/react'
import { useWeb3ModalTheme } from '@web3modal/react'
import {
  Logo,
  LogoWithTextBlack,
  LogoWithTextWhite,
} from '../../../assets/AssetsManager'
import { useUserContext } from '../../../context/userContext'

export default function useHeader() {
  // Nav bar toggle
  const { isOpen, onToggle } = useDisclosure()

  // Media query for mobile
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  // Wallet connect account
  const { setTheme } = useWeb3ModalTheme()

  const { userAddress } = useUserContext()

  // Theme toggle
  const { colorMode, toggleColorMode } = useColorMode()

  const toggleColor = () => {
    toggleColorMode()

    setTheme({
      themeMode: colorMode === 'light' ? 'dark' : 'light',
    })
  }

  // Logo
  const logo = () => {
    if (isMobile) {
      return Logo
    }

    if (colorMode === 'light') {
      return LogoWithTextBlack
    }
    return LogoWithTextWhite
  }

  return {
    isOpen,
    onToggle,
    isMobile,
    isConnected: userAddress !== null,
    toggleColor,
    logo,
    colorMode,
  }
}
