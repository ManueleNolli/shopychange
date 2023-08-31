import { act, renderHook } from '@testing-library/react'
import useWithdrawRoyaltyButton from '../useWithdrawRoyaltyButton'
import { useUserContext } from '../../../context/userContext'
import { handlerQueryErrorCatch } from '../../../services/BackendService'
import {
  waitTransaction,
  withdrawRoyalty,
} from '../../../services/BlockchainService'
import { useToast } from '@chakra-ui/react'

jest.mock('../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

jest.mock('../../../hooks/useLoading', () => () => ({
  isLoading: false,
  setIsLoading: jest.fn(),
}))

jest.mock('../../../hooks/useFetching', () => () => ({
  isFetching: false,
  setIsFetching: jest.fn(),
  isError: false,
  setIsError: jest.fn(),
}))

jest.mock('../../../services/BlockchainService', () => ({
  withdrawRoyalty: jest.fn(),
  waitTransaction: jest.fn(),
}))

jest.mock('../../../services/BackendService', () => ({
  handlerQueryErrorCatch: jest.fn(),
  collectionRoyaltiesQuery: jest.fn(),
  tokenRoyaltiesQuery: jest.fn(),
}))

jest.mock('@chakra-ui/react', () => ({
  useToast: jest.fn(),
}))

const mockProps = {
  collectionAddress: '0x123',
  tokenId: 0,
  buttonProps: {
    maxW: '20em',
    w: '20em',
  },
}

describe('useWithdrawRoyaltyButton', () => {
  test('fetching error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValueOnce({
      userAddress: '0x123',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      error: true,
    })

    const { result } = renderHook(() => useWithdrawRoyaltyButton(mockProps))

    expect(result.current.isFetching).toBe(false)
    expect(result.current.withdrawValue).toBe(0)
  })

  test('fetching works', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x123',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        withdrawRoyaltyToken: {
          paymentSplitterAddress: '0x11111',
          receivers: [
            {
              receiver: '0x123',
              amount: 4,
            },
          ],
        },
      },
    })

    const { result } = renderHook(() => useWithdrawRoyaltyButton(mockProps))

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(result.current.isFetching).toBe(false)
    expect(result.current.withdrawValue).toBe(4)
    expect(result.current.hasPaymentSplitter).toBe(true)
  })

  test('fetching works, no payment splitter', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x123',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        withdrawRoyaltyToken: {
          paymentSplitterAddress: null,
        },
      },
    })

    const { result } = renderHook(() => useWithdrawRoyaltyButton(mockProps))

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(result.current.hasPaymentSplitter).toBe(false)
  })

  test('fetching works, colleciton', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x123',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        withdrawRoyaltyCollection: {
          paymentSplitterAddress: '0x11111',
          receivers: [
            {
              receiver: '0x123',
              amount: 4,
            },
          ],
        },
      },
    })

    const { result } = renderHook(() =>
      useWithdrawRoyaltyButton({
        collectionAddress: '0x123',
        tokenId: undefined,
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(result.current.hasPaymentSplitter).toBe(true)
    expect(result.current.withdrawValue).toBe(4)
  })

  test('fetching colleciton error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x123',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      error: true,
    })

    const { result } = renderHook(() =>
      useWithdrawRoyaltyButton({
        collectionAddress: '0x123',
        tokenId: undefined,
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(result.current.isFetching).toBe(false)
    expect(result.current.withdrawValue).toBe(0)
  })

  test('withdraw works', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        withdrawRoyaltyToken: {
          paymentSplitterAddress: '0x11111',
          receivers: [
            {
              receiver: '0x123',
              amount: 4,
            },
          ],
        },
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x123',
      blockchainNetworkId: 1,
    })
    ;(withdrawRoyalty as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useWithdrawRoyaltyButton(mockProps))

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    const { withdraw } = result.current

    await act(async () => {
      await withdraw()
    })

    expect(result.current.isLoading).toBe(false)
    expect(withdrawRoyalty).toBeCalledWith('0x11111', 0)
  })

  test('withdraw error', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        withdrawRoyaltyToken: {
          paymentSplitterAddress: '0x11111',
          receivers: [
            {
              receiver: '0x123',
              amount: 4,
            },
          ],
        },
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x123',
      blockchainNetworkId: 1,
    })
    ;(withdrawRoyalty as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() => useWithdrawRoyaltyButton(mockProps))

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    const { withdraw } = result.current

    await act(async () => {
      await withdraw()
    })

    expect(result.current.isLoading).toBe(false)
    expect(withdrawRoyalty).toBeCalledWith('0x11111', 0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('return is useAddress not defined', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        withdrawRoyaltyToken: {
          paymentSplitterAddress: '0x11111',
          receivers: [
            {
              receiver: '0x123',
              amount: 4,
            },
          ],
        },
      },
    })

    renderHook(() => useWithdrawRoyaltyButton(mockProps))

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(handlerQueryErrorCatch).toHaveBeenCalledTimes(0)
  })
})
