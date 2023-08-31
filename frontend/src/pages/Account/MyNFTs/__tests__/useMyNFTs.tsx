import { act, renderHook } from '@testing-library/react'
import useMyNFTs from '../useMyNFTs'
import { useUserContext } from '../../../../context/userContext'
import { handlerQueryErrorCatch } from '../../../../services/BackendService'

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
  handlerQueryErrorCatch: jest.fn(),
  ownedNftsQuery: jest.fn(),
}))

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

const mockedData = {
  ownedNfts: [
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
}

describe('useMyNFTs', () => {
  test('fetching owned NFTs', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      blockchainNetworkId: 1,
      userAddress: '0x1203A6e8bD6A063AEa9D4B7F8A2BaE9405fE44Cd',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValue({
      error: false,
      result: {
        ownedNfts: mockedData.ownedNfts,
      },
    })

    const { result } = renderHook(() => useMyNFTs())

    await act(async () => {
      await Promise.resolve() // wait for useEffect to resolve
    })

    expect(result.current.isFetching).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.ownedNfts).toEqual(mockedData.ownedNfts)
  })

  test('fetching error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      blockchainNetworkId: 1,
      userAddress: '0x1203A6e8bD6A063AEa9D4B7F8A2BaE9405fE44Cd',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValue({
      error: true,
      result: {
        ownedNfts: mockedData.ownedNfts,
      },
    })

    const { result } = renderHook(() => useMyNFTs())

    await act(async () => {
      await Promise.resolve() // wait for useEffect to resolve
    })

    expect(result.current.isFetching).toBe(false)
    expect(result.current.ownedNfts).toEqual([])
  })

  test('return if userAddress not defined', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      blockchainNetworkId: 1,
      userAddress: undefined,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValue({
      error: true,
      result: {
        ownedNfts: mockedData.ownedNfts,
      },
    })

    renderHook(() => useMyNFTs())

    await act(async () => {
      await Promise.resolve() // wait for useEffect to resolve
    })

    expect(handlerQueryErrorCatch).not.toHaveBeenCalled()
  })

  test('onNavigateToObservedCollections calls navigate', () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      blockchainNetworkId: 1,
      userAddress: undefined,
    })
    const { result } = renderHook(() => useMyNFTs())

    result.current.onNavigateToObservedCollections()

    expect(mockNavigate).toHaveBeenCalledWith(
      '/account/dashboard/observed-collections'
    )
  })
})
