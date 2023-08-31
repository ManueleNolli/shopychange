import { act, renderHook } from '@testing-library/react'
import useAccountAddressPage from '../useAccountAddressPage'
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
  ownedNftsQuery: jest.fn(),
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

describe('useAccountAddressPage', () => {
  test('fetching nfts', async () => {
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

    const { result } = renderHook(() =>
      useAccountAddressPage('0x1203A6e8bD6A063AEa9D4B7F8A2BaE9405fE44Cd')
    )

    await act(async () => {
      await Promise.resolve() // wait for useEffect to resolve
    })

    expect(result.current.isFetching).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.nfts).toEqual(mockedData.ownedNfts)
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

    const { result } = renderHook(() =>
      useAccountAddressPage('0x1203A6e8bD6A063AEa9D4B7F8A2BaE9405fE44Cd')
    )

    await act(async () => {
      await Promise.resolve() // wait for useEffect to resolve
    })

    expect(result.current.isFetching).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.nfts).toEqual([])
  })

  test('return if blockchain not defined', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      blockchainNetworkId: undefined,
      userAddress: '0x1203A6e8bD6A063AEa9D4B7F8A2BaE9405fE44Cd',
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValue({
      error: true,
      result: {
        ownedNfts: mockedData.ownedNfts,
      },
    })

    renderHook(() =>
      useAccountAddressPage('0x1203A6e8bD6A063AEa9D4B7F8A2BaE9405fE44Cd')
    )

    await act(async () => {
      await Promise.resolve() // wait for useEffect to resolve
    })

    expect(handlerQueryErrorCatch).not.toHaveBeenCalled()
  })
})
