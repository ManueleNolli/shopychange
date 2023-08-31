import { act, renderHook } from '@testing-library/react'

import useCollectionRoyalties from '../useCollectionRoyalties'
import { useUserContext } from '../../../context/userContext'
import { handlerQueryErrorCatch } from '../../../services/BackendService'
import {
  updateCollectionRoyalties,
  waitTransaction,
  resetDefaultCollectionRoyalties,
} from '../../../services/BlockchainService'
import { useToast } from '@chakra-ui/react'

jest.mock('../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

jest.mock('../../../hooks/useLoading', () => () => ({
  isLoading: false,
  setIsLoading: jest.fn(),
}))

jest.mock('../../../services/BlockchainService', () => ({
  updateCollectionRoyalties: jest.fn(),
  resetDefaultCollectionRoyalties: jest.fn(),
  waitTransaction: jest.fn(),
}))

jest.mock('../../../services/BackendService', () => ({
  collectionRoyaltyQuery: jest.fn(),
  handlerQueryErrorCatch: jest.fn(),
}))

jest.mock('../../../hooks/useFetching', () => () => ({
  isFetching: false,
  setIsFetching: jest.fn(),
  isError: false,
  setIsError: jest.fn(),
}))

jest.mock('@chakra-ui/react', () => ({
  useToast: jest.fn(),
}))

describe('useCollectionRoyalties', () => {
  beforeEach(() => {
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValueOnce(mockToast)
  })

  test('fetcing', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      result: {
        contract: {
          name: 'Contract',
          symbol: 'symbol',
          address: 'mockedAddress',
        },
        royaltyCollection: {
          royalties: [
            {
              receiver: '0x00',
              share: 10,
            },
          ],
          royaltySum: 10,
          supportsErc2981: true,
          supportsErc2981MultiReceiver: true,
          hasPaymentSplitter: true,
        },
      },
    })

    const { result } = renderHook(() => useCollectionRoyalties('mockedAddress'))

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.collection).toEqual({
      name: 'Contract',
      symbol: 'symbol',
      address: 'mockedAddress',
    })

    expect(result.current.royalties).toEqual({
      royalties: [
        {
          receiver: '0x00',
          share: 10,
        },
      ],
      royaltySum: 10,
      supportsErc2981: true,
      supportsErc2981MultiReceiver: true,
      hasPaymentSplitter: true,
    })
  })

  test('fetcing error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      error: true,
      result: {
        contract: {
          name: 'Contract',
          symbol: 'symbol',
          address: 'mockedAddress',
        },
        royaltyCollection: {
          royalties: [
            {
              receiver: '0x00',
              share: 10,
            },
          ],
          royaltySum: 10,
          supportsErc2981: true,
          supportsErc2981MultiReceiver: true,
          hasPaymentSplitter: true,
        },
      },
    })

    const { result } = renderHook(() => useCollectionRoyalties('mockedAddress'))

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.collection).toEqual(undefined)
    expect(result.current.royalties).toEqual(undefined)
  })

  test('fetcing return if user no connected', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      error: true,
      result: {
        contract: {
          name: 'Contract',
          symbol: 'symbol',
          address: 'mockedAddress',
        },
        royaltyCollection: {
          royalties: [
            {
              receiver: '0x00',
              share: 10,
            },
          ],
          royaltySum: 10,
          supportsErc2981: true,
          supportsErc2981MultiReceiver: true,
          hasPaymentSplitter: true,
        },
      },
    })

    renderHook(() => useCollectionRoyalties('mockedAddress'))

    await act(async () => {
      await Promise.resolve()
    })

    expect(handlerQueryErrorCatch).not.toHaveBeenCalled()
  })

  test('handle submit', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      error: true,
      result: {
        contract: {
          name: 'Contract',
          symbol: 'symbol',
          address: 'mockedAddress',
        },
        royaltyCollection: {
          royalties: [
            {
              receiver: '0x00',
              share: 10,
            },
          ],
          royaltySum: 10,
          supportsErc2981: true,
          supportsErc2981MultiReceiver: true,
          hasPaymentSplitter: true,
        },
      },
    })
    ;(updateCollectionRoyalties as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})

    const { result } = renderHook(() => useCollectionRoyalties('mockedAddress'))

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.handleSubmit({
        royalties: [
          {
            receiver: '0x00',
            share: 10,
          },
        ],
      })

      expect(updateCollectionRoyalties).toHaveBeenCalledTimes(1)
      expect(waitTransaction).toHaveBeenCalledTimes(1)
    })
  })

  test('handle submit error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      error: true,
      result: {
        contract: {
          name: 'Contract',
          symbol: 'symbol',
          address: 'mockedAddress',
        },
        royaltyCollection: {
          royalties: [
            {
              receiver: '0x00',
              share: 10,
            },
          ],
          royaltySum: 10,
          supportsErc2981: true,
          supportsErc2981MultiReceiver: true,
          hasPaymentSplitter: true,
        },
      },
    })
    ;(updateCollectionRoyalties as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})

    const { result } = renderHook(() => useCollectionRoyalties('mockedAddress'))

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.handleSubmit({
        royalties: [
          {
            receiver: '0x00',
            share: 10,
          },
        ],
      })

      expect(updateCollectionRoyalties).toHaveBeenCalledTimes(1)
      expect(waitTransaction).toHaveBeenCalledTimes(0)
    })
  })

  test('handle Remove Default', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      error: true,
      result: {
        contract: {
          name: 'Contract',
          symbol: 'symbol',
          address: 'mockedAddress',
        },
        royaltyCollection: {
          royalties: [
            {
              receiver: '0x00',
              share: 10,
            },
          ],
          royaltySum: 10,
          supportsErc2981: true,
          supportsErc2981MultiReceiver: true,
          hasPaymentSplitter: true,
        },
      },
    })
    ;(resetDefaultCollectionRoyalties as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})

    const { result } = renderHook(() => useCollectionRoyalties('mockedAddress'))

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.handleRemoveDefault()
    })

    expect(resetDefaultCollectionRoyalties).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(1)
  })

  test('handle Remove Default error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      error: true,
      result: {
        contract: {
          name: 'Contract',
          symbol: 'symbol',
          address: 'mockedAddress',
        },
        royaltyCollection: {
          royalties: [
            {
              receiver: '0x00',
              share: 10,
            },
          ],
          royaltySum: 10,
          supportsErc2981: true,
          supportsErc2981MultiReceiver: true,
          hasPaymentSplitter: true,
        },
      },
    })
    ;(resetDefaultCollectionRoyalties as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})

    const { result } = renderHook(() => useCollectionRoyalties('mockedAddress'))

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.handleRemoveDefault()
    })

    expect(resetDefaultCollectionRoyalties).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })
})
