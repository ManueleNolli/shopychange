import { renderHook, act } from '@testing-library/react'
import useAdmin from '../useAdmin'
import { useUserContext } from '../../../context/userContext'
import { handlerQueryErrorCatch } from '../../../services/BackendService'
import { useToast } from '@chakra-ui/react'

import {
  cancelSale,
  cleanMarketplaceStorage,
  setNewRoyalty,
  waitTransaction,
  withdrawOwner,
  withdrawTo,
  withdrawToAmount as withdrawToAmountService,
} from '../../../services/BlockchainService'

jest.mock('@chakra-ui/react', () => ({
  useToast: jest.fn(),
}))

jest.mock('../../../services/BackendService', () => ({
  handlerQueryErrorCatch: jest.fn(),
  AdminQuery: jest.fn(),
  salesQuery: jest.fn(),
}))

jest.mock('../../../services/BlockchainService', () => ({
  cleanMarketplaceStorage: jest.fn(),
  cancelSale: jest.fn(),
  setNewRoyalty: jest.fn(),
  waitTransaction: jest.fn(),
  withdrawOwner: jest.fn(),
  withdrawTo: jest.fn(),
  withdrawToAmount: jest.fn(),
}))

const mockData = {
  marketplaceRoyalty: 30,
  marketplaceBalance: 100,
  sales: [
    {
      contractAddress: 'mockContractAddress',
      tokenId: 0,
      image: 'mockImage',
      name: 'mockName',
    },
    {
      contractAddress: 'mockContractAddress1',
      tokenId: 1,
      image: 'mockImage',
      name: 'mockName',
    },
  ],
}

jest.mock('../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

jest.mock('../../../hooks/useLoading', () => () => ({
  isLoading: false,
  setIsLoading: jest.fn(),
}))

describe('useAdmin', () => {
  beforeEach(() => {
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValueOnce(mockToast)
  })
  test('fetching ', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.sales).toEqual(mockData.sales)
    expect(result.current.marketplaceBalance).toEqual(
      mockData.marketplaceBalance
    )
    expect(result.current.royaltyValue).toEqual(mockData.marketplaceRoyalty)
  })

  test('fetching return if user not defined', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.sales).toEqual([])
    expect(result.current.marketplaceBalance).toEqual(null)
    expect(result.current.royaltyValue).toEqual(null)
  })

  test('fetching error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
      error: true,
    })

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.sales).toEqual([])
    expect(result.current.marketplaceBalance).toEqual(null)
    expect(result.current.royaltyValue).toEqual(null)
  })

  test('call updateRoyaltyValue', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(setNewRoyalty as jest.Mock).mockResolvedValue({})
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: {
        marketplaceRoyalty: 30,
        marketplaceBalance: 100,
        sales: [],
      },
    })
    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.updateRoyaltyValue()
    })

    expect(setNewRoyalty).toHaveBeenCalled()
    expect(waitTransaction).toHaveBeenCalled()
  })

  test('call updateRoyaltyValue fails', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(setNewRoyalty as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.updateRoyaltyValue()
    })

    expect(setNewRoyalty).toHaveBeenCalled()
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('call updateRoyaltyValue return', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(setNewRoyalty as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.updateRoyaltyValue()
    })

    expect(setNewRoyalty).toHaveBeenCalledTimes(0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('call cleanStorage', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(cleanMarketplaceStorage as jest.Mock).mockResolvedValue({})
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.cleanStorage()
    })

    expect(cleanMarketplaceStorage).toHaveBeenCalled()
    expect(waitTransaction).toHaveBeenCalled()
  })

  test('call cleanStorage fails', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(cleanMarketplaceStorage as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.cleanStorage()
    })

    expect(cleanMarketplaceStorage).toHaveBeenCalled()
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('call cleanStorage return', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: undefined,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(cleanMarketplaceStorage as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.cleanStorage()
    })

    expect(cleanMarketplaceStorage).toHaveBeenCalledTimes(0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('call onCancelSale', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(cancelSale as jest.Mock).mockResolvedValue({})
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.onCancelSale()
    })

    expect(cancelSale).toHaveBeenCalled()
    expect(waitTransaction).toHaveBeenCalled()
  })

  test('call onCancelSale fails', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(cancelSale as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.onCancelSale()
    })

    expect(cancelSale).toHaveBeenCalled()
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('call onCancelSale return', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: undefined,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(cancelSale as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.onCancelSale()
    })

    expect(cancelSale).toHaveBeenCalledTimes(0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('call onCancelSale return if saleToCancel empty', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(cancelSale as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: {
        marketplaceRoyalty: 30,
        marketplaceBalance: 100,
        sales: [],
      },
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.onCancelSale()
    })

    expect(cancelSale).toHaveBeenCalledTimes(0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('call withdraw', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(withdrawOwner as jest.Mock).mockResolvedValue({})
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.withdraw()
    })

    expect(withdrawOwner).toHaveBeenCalled()
    expect(waitTransaction).toHaveBeenCalled()
  })

  test('call withdraw fails', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(withdrawOwner as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.withdraw()
    })

    expect(withdrawOwner).toHaveBeenCalled()
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('call withdraw return', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: undefined,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(withdrawOwner as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.withdraw()
    })

    expect(withdrawOwner).toHaveBeenCalledTimes(0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('call withdrawToAll', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(withdrawTo as jest.Mock).mockResolvedValue({})
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.withdrawToAll('0x00')
    })

    expect(withdrawTo).toHaveBeenCalled()
    expect(waitTransaction).toHaveBeenCalled()
  })

  test('call withdrawToAll fails', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(withdrawTo as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.withdrawToAll('0x00')
    })

    expect(withdrawTo).toHaveBeenCalled()
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('call withdrawToAll return', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: undefined,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(withdrawTo as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.withdrawToAll('0x00')
    })

    expect(withdrawTo).toHaveBeenCalledTimes(0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('call withdrawToAmount', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(withdrawToAmountService as jest.Mock).mockResolvedValue({})
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.withdrawToAmount('0x00', 1)
    })

    expect(withdrawToAmountService).toHaveBeenCalled()
    expect(waitTransaction).toHaveBeenCalled()
  })

  test('call withdrawToAmount fails', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: 1,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(withdrawToAmountService as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.withdrawToAmount('0x00', 1)
    })

    expect(withdrawToAmountService).toHaveBeenCalled()
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('call withdrawToAmount return', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: 'mockUserAddress',
      blockchainNetworkId: undefined,
    })
    ;(waitTransaction as jest.Mock).mockResolvedValue({})
    ;(withdrawToAmountService as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: mockData,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useAdmin())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.withdrawToAmount('0x00', 1)
    })

    expect(withdrawToAmountService).toHaveBeenCalledTimes(0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })
})
