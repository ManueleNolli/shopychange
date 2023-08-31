import { act, renderHook } from '@testing-library/react'
import useHome from '../useHome'
import { useUserContext } from '../../../context/userContext'
import { handlerQueryErrorCatch } from '../../../services/BackendService'

jest.mock('../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

jest.mock('../../../hooks/useFetching', () => () => ({
  isFetching: false,
  setIsFetching: jest.fn(),
  isError: false,
  setIsError: jest.fn(),
}))

jest.mock('../../../services/BackendService', () => ({
  handlerQueryErrorCatch: jest.fn(),
  salesQuery: jest.fn(),
}))

describe('useHome', () => {
  test('returns the correct values', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      blockchainNetworkId: 1,
      userAddress: '0x0000001',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        sales: [
          {
            contractAddress: '0x0000000000',
            tokenId: 0,
            image: 'image',
            name: 'name',
          },
        ],
      },
    })
    const { result } = renderHook(() => useHome())

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(result.current).toEqual({
      sales: [
        {
          contractAddress: '0x0000000000',
          tokenId: 0,
          image: 'image',
          name: 'name',
        },
      ],
      isFetching: false,
      isError: false,
      isConnected: true,
    })
  })

  test('fetching error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      blockchainNetworkId: 1,
      userAddress: '0x0000001',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      error: true,
      result: {
        sales: [
          {
            contractAddress: '0x0000000000',
            tokenId: 0,
            image: 'image',
            name: 'name',
          },
        ],
      },
    })
    const { result } = renderHook(() => useHome())

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(result.current).toEqual({
      sales: [],
      isFetching: false,
      isError: false,
      isConnected: true,
    })
  })

  test('return if blockchainId is undefined', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      blockchainNetworkId: undefined,
      userAddress: '0x0000001',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      error: true,
      result: {
        sales: [
          {
            contractAddress: '0x0000000000',
            tokenId: 0,
            image: 'image',
            name: 'name',
          },
        ],
      },
    })
    renderHook(() => useHome())

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(handlerQueryErrorCatch).not.toHaveBeenCalled()
  })
})
