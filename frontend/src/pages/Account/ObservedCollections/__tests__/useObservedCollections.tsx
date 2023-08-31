import { act, renderHook } from '@testing-library/react'
import useObservedCollections from '../useObservedCollections'
import { useUserContext } from '../../../../context/userContext'
import {
  handlerQueryErrorCatch,
  handlerMutation,
} from '../../../../services/BackendService'

jest.mock('../../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))
jest.mock('../../../../hooks/useFetching', () => () => ({
  isFetching: false,
  setIsFetching: jest.fn(),
  isError: false,
  setIsError: jest.fn(),
}))

jest.mock('../../../../services/BackendService', () => ({
  AddNFTCollectionsMutation: jest.fn(),
  RemoveNFTCollectionsMutation: jest.fn(),
  contractObservedQuery: jest.fn(),
  handlerQueryErrorCatch: jest.fn(),
  handlerMutation: jest.fn(),
}))

describe('useObservedCollections', () => {
  test('fetching error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValueOnce({
      userAddress: '0x123',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      error: true,
    })

    const { result } = renderHook(() => useObservedCollections())

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.isObservedFetching).toBeFalsy()
    expect(result.current.observedCollections).toEqual([])
  })

  test('fetching success', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x123',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      error: false,
      result: {
        contractObserved: ['0x123'],
      },
    })

    const { result } = renderHook(() => useObservedCollections())

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.isObservedError).toBeFalsy()
    expect(result.current.isObservedFetching).toBeFalsy()
    expect(result.current.observedCollections).toEqual(['0x123'])
  })

  test('fetching return if address undefined', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      error: false,
      result: {
        contractObserved: ['0x123'],
      },
    })

    renderHook(() => useObservedCollections())

    await act(async () => {
      await Promise.resolve()
    })

    expect(handlerQueryErrorCatch).toBeCalledTimes(0)
  })

  test('handleSubmit', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x123',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      error: false,
      result: {
        contractObserved: ['0x123'],
      },
    })
    ;(handlerMutation as jest.Mock).mockResolvedValue({
      error: false,
    })

    const { result } = renderHook(() => useObservedCollections())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.handleSubmit({
        observedCollections: ['0x456'],
      })
    })

    expect(result.current.isObservedError).toBeFalsy()
    expect(result.current.isObservedFetching).toBeFalsy()

    expect(handlerMutation).toBeCalledTimes(2)
  })

  test('handleSubmit return if address undefined', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      error: false,
      result: {
        contractObserved: ['0x123'],
      },
    })
    ;(handlerMutation as jest.Mock).mockResolvedValue({
      error: false,
    })

    const { result } = renderHook(() => useObservedCollections())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.handleSubmit({
        observedCollections: ['0x456'],
      })
    })

    expect(handlerMutation).toBeCalledTimes(0)
  })

  test('handleSubmit error adding', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x123',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      error: false,
      result: {
        contractObserved: [],
      },
    })

    // mock handlerMutation to return error only on second call
    ;(handlerMutation as jest.Mock).mockResolvedValueOnce({
      error: true,
    })

    const { result } = renderHook(() => useObservedCollections())

    await act(async () => {
      await result.current.handleSubmit({
        observedCollections: ['0x123'],
      })
    })

    expect(handlerMutation).toBeCalledTimes(1)
  })

  test('handleSubmit error second', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x123',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      error: false,
      result: {
        contractObserved: ['0x123'],
      },
    })

    // mock handlerMutation to return error only on second call
    ;(handlerMutation as jest.Mock).mockResolvedValueOnce({
      error: true,
    })

    const { result } = renderHook(() => useObservedCollections())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.handleSubmit({
        observedCollections: [],
      })
    })

    expect(result.current.isObservedFetching).toBeFalsy()
    expect(handlerMutation).toBeCalledTimes(1)
  })
})
