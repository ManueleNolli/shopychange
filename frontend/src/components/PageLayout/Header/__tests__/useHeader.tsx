import { useColorMode, useDisclosure, useMediaQuery } from '@chakra-ui/react'
import useHeader from '../useHeader'
import { useUserContext } from '../../../../context/userContext'
import { useWeb3ModalTheme } from '@web3modal/react'
import {
  Logo,
  LogoWithTextBlack,
  LogoWithTextWhite,
} from '../../../../assets/AssetsManager'

jest.mock('@web3modal/react', () => ({
  useWeb3ModalTheme: jest.fn(),
}))

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useMediaQuery: jest.fn(),
  useColorMode: jest.fn(),
  useDisclosure: jest.fn(),
}))

jest.mock('../../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

describe('useHeader', () => {
  test('should return logo, mobile', () => {
    ;(useMediaQuery as jest.Mock).mockImplementation(() => [true])
    ;(useDisclosure as jest.Mock).mockImplementation(() => [false])
    ;(useWeb3ModalTheme as jest.Mock).mockImplementation(() => jest.fn())
    ;(useColorMode as jest.Mock).mockImplementation(() => ({
      colorMode: 'light',
      toggleColorMode: jest.fn(),
    }))
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    const { logo } = useHeader()

    const result = logo()
    expect(logo).toBeDefined()
    expect(result).toEqual(Logo)
  })

  test('should return logo, desktop light', () => {
    ;(useMediaQuery as jest.Mock).mockImplementation(() => [false])
    ;(useDisclosure as jest.Mock).mockImplementation(() => [false])
    ;(useWeb3ModalTheme as jest.Mock).mockImplementation(() => jest.fn())
    ;(useColorMode as jest.Mock).mockImplementation(() => ({
      colorMode: 'light',
      toggleColorMode: jest.fn(),
    }))
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    const { logo } = useHeader()

    const result = logo()
    expect(logo).toBeDefined()
    expect(result).toEqual(LogoWithTextBlack)
  })

  test('should return logo, desktop dark', () => {
    ;(useMediaQuery as jest.Mock).mockImplementation(() => [false])
    ;(useDisclosure as jest.Mock).mockImplementation(() => [false])
    ;(useWeb3ModalTheme as jest.Mock).mockImplementation(() => jest.fn())
    ;(useColorMode as jest.Mock).mockImplementation(() => ({
      colorMode: 'dark',
      toggleColorMode: jest.fn(),
    }))
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    const { logo } = useHeader()

    const result = logo()
    expect(logo).toBeDefined()
    expect(result).toEqual(LogoWithTextWhite)
  })

  test('should toggle color', () => {
    ;(useMediaQuery as jest.Mock).mockImplementation(() => [false])
    ;(useDisclosure as jest.Mock).mockImplementation(() => [false])
    const mockSetTheme = jest.fn()
    ;(useWeb3ModalTheme as jest.Mock).mockImplementation(() => ({
      setTheme: mockSetTheme,
    }))
    ;(useColorMode as jest.Mock).mockImplementation(() => ({
      colorMode: 'dark',
      toggleColorMode: jest.fn(),
    }))
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    const { toggleColor } = useHeader()

    toggleColor()

    expect(toggleColor).toBeDefined()
    expect(mockSetTheme).toHaveBeenCalled()
  })
})
