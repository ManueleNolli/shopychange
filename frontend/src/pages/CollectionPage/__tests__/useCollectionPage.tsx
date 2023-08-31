import { act, renderHook } from '@testing-library/react'
import useCollectionPage from '../useCollectionPage'
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
  collectionQuery: jest.fn(),
}))

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

const mockedData = {
  collection: {
    contract: {
      name: 'Test Collection',
      symbol: 'TEST',
      address: '0x0000000000000000000000000000000000000000',
    },
    nfts: [
      {
        contractAddress: '0x0000000000',
        tokenId: '0',
        image: 'https://example.com/image.png',
        name: 'Test NFT',
      },
      {
        contractAddress: '0x0000000001',
        tokenId: '1',
        image: 'https://example.com/image.png',
        name: 'Test1 NFT',
      },
    ],
  },
}

describe('useCollectionPage', () => {
  test('fetching collection', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValue({
      error: false,
      result: {
        collection: mockedData.collection,
      },
    })

    const { result } = renderHook(() =>
      useCollectionPage('0x0000000000000000000000000000000000000000')
    )

    await act(async () => {
      await Promise.resolve() // wait for useEffect to resolve
    })

    expect(result.current.isFetching).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.collection).toEqual(mockedData.collection)
  })

  test('fetching error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValue({
      error: true,
      result: {
        collection: mockedData.collection,
      },
    })

    const { result } = renderHook(() =>
      useCollectionPage('0x0000000000000000000000000000000000000000')
    )

    await act(async () => {
      await Promise.resolve() // wait for useEffect to resolve
    })

    expect(result.current.isFetching).toBe(false)
    expect(result.current.collection).toEqual({
      contract: {
        name: '',
        symbol: '',
        address: '',
      },
      nfts: [],
    })
  })

  test('return if blockchain not defined', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      blockchainNetworkId: undefined,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValue({
      error: true,
      result: {
        collection: mockedData.collection,
      },
    })

    renderHook(() =>
      useCollectionPage('0x0000000000000000000000000000000000000000')
    )

    await act(async () => {
      await Promise.resolve() // wait for useEffect to resolve
    })

    expect(handlerQueryErrorCatch).not.toHaveBeenCalled()
  })

  test('onNavigate calls navigate with collection contract address', () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      blockchainNetworkId: undefined,
    })
    const { result } = renderHook(() => useCollectionPage('0x000000'))

    result.current.onNavigate()

    expect(mockNavigate).toHaveBeenCalledWith('/0x000000/royalties')
  })
})
