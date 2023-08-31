import { useToast } from '@chakra-ui/react'
import {
  modifySale,
  waitTransaction,
} from '../../../../services/BlockchainService'
import useModifySalePopoverContent from '../useModifySalePopoverContent'
import { useUserContext } from '../../../../context/userContext'
import { act, renderHook } from '@testing-library/react'

jest.mock('../../../../services/BlockchainService', () => ({
  waitTransaction: jest.fn(),
  modifySale: jest.fn(),
}))

jest.mock('@chakra-ui/react', () => ({
  useToast: jest.fn(),
}))

jest.mock('../../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

jest.mock('../../../../hooks/useLoading', () => () => ({
  isLoading: false,
  setIsLoading: jest.fn(),
}))

const mockProps = {
  nft: {
    contractAddress: '0x0000000000',
    tokenId: 0,
    image:
      'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q',
    name: 'Test NFT',
  },
  onClose: jest.fn(),
  actualPrice: 0.4,
}

describe('useCancelSalePopoverContent', () => {
  beforeEach(() => {
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValueOnce(mockToast)
  })
  test('onPriceChange', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })

    const { result } = renderHook(() =>
      useModifySalePopoverContent({
        nft: mockProps.nft,
        onClose: mockProps.onClose,
        onSucess: jest.fn(),
        actualPrice: mockProps.actualPrice,
      })
    )

    const { onPriceChange } = result.current

    await act(async () => {
      onPriceChange('10')
    })

    expect(onPriceChange).toBeDefined()
    expect(result.current.newPrice).toBe(10)
  })

  test('cancelSale function works as expected', async () => {
    // Mocking necessary functions
    ;(modifySale as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })

    const onClose = jest.fn()
    const onSuccess = jest.fn()

    const { result } = renderHook(() =>
      useModifySalePopoverContent({
        nft: mockProps.nft,
        onClose: onClose,
        onSucess: onSuccess,
        actualPrice: 0.4,
      })
    )

    const { onPriceChange } = result.current

    //first modify the price and the call modify
    await act(async () => {
      onPriceChange('10')
    })

    const { modify } = result.current
    await act(async () => {
      await modify()
    })

    // Perform assertions
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(modifySale).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(1)
  })

  test('cancelSale function fails', async () => {
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValueOnce(mockToast)

    // Mocking necessary functions
    ;(modifySale as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })

    const onClose = jest.fn()
    const onSuccess = jest.fn()

    const { result } = renderHook(() =>
      useModifySalePopoverContent({
        nft: mockProps.nft,
        onClose: onClose,
        onSucess: onSuccess,
        actualPrice: 0.4,
      })
    )

    const { onPriceChange } = result.current

    //first modify the price and the call modify
    await act(async () => {
      onPriceChange('10')
    })

    const { modify } = result.current
    await act(async () => {
      await modify()
    })

    // Perform assertions
    expect(onClose).toHaveBeenCalledTimes(0)
    expect(onSuccess).toHaveBeenCalledTimes(0)
    expect(modifySale).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('return is user and network are not defined', async () => {
    // Mocking necessary functions
    ;(modifySale as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: undefined,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValueOnce(mockToast)

    const onClose = jest.fn()
    const onSuccess = jest.fn()

    const { result } = renderHook(() =>
      useModifySalePopoverContent({
        nft: mockProps.nft,
        onClose: onClose,
        onSucess: onSuccess,
        actualPrice: 0.4,
      })
    )

    const { onPriceChange } = result.current

    //first modify the price and the call modify
    await act(async () => {
      onPriceChange('10')
    })

    const { modify } = result.current
    await act(async () => {
      await modify()
    })

    // Perform assertions
    expect(onClose).toHaveBeenCalledTimes(0)
    expect(onSuccess).toHaveBeenCalledTimes(0)
    expect(modifySale).toHaveBeenCalledTimes(0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })
})
