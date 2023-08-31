import { act, renderHook } from '@testing-library/react'

import { NFT } from '../../../types/components/NFT'
import useNFTCard from '../useNFTCard'
import { handlerQueryErrorCatch } from '../../../services/BackendService'
import { useUserContext } from '../../../context/userContext'
import CheckImageSrc from '../../../utils/CheckImageSrc/CheckImageSrc'

const nftMock: NFT = {
  contractAddress: '0x0000000000',
  tokenId: 0,
  image:
    'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q',
  name: 'Test NFT',
}

jest.mock('../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

jest.mock('../../../services/BackendService', () => ({
  handlerQueryErrorCatch: jest.fn(),
  saleQuery: jest.fn(),
}))

jest.mock('../../../hooks/useFetching', () => () => ({
  isFetching: false,
  setIsFetching: jest.fn(),
  isError: false,
  setIsError: jest.fn(),
}))

jest.mock('../../../utils/CheckImageSrc/CheckImageSrc', () => jest.fn())

describe('useNFTCard', () => {
  test('fetching error', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      error: true,
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(CheckImageSrc as jest.Mock).mockResolvedValueOnce(true)

    const { result } = renderHook(() =>
      useNFTCard({ nft: nftMock, saleButton: true })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(result.current.isFetching).toBeFalsy()
    expect(result.current.image).toEqual(nftMock.image)
    expect(result.current.sale).toBeNull()
    expect(result.current.updateSale).toBeDefined()
  })

  test('fetch correctly', async () => {
    const saleMock = {
      nftData: {
        contractAddress: '0x0000000000',
        tokenId: 0,
        image: 'image',
        name: 'Test NFT',
      },
      price: 0,
      seller: '0x0000000000',
      status: 0,
    }
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        sale: saleMock,
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(CheckImageSrc as jest.Mock).mockResolvedValueOnce(true)

    const { result } = renderHook(() =>
      useNFTCard({ nft: nftMock, saleButton: true })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(result.current.isFetching).toBeFalsy()
    expect(result.current.image).toEqual(nftMock.image)
    expect(result.current.sale).toBe(saleMock)
    expect(result.current.updateSale).toBeDefined()
  })

  test('calling callback', async () => {
    const saleMock = {
      nftData: {
        contractAddress: '0x0000000000',
        tokenId: 0,
        image: undefined,
        name: 'Test NFT',
      },
      price: 0,
      seller: '0x0000000000',
      status: 0,
    }
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: {
        sale: saleMock,
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(CheckImageSrc as jest.Mock).mockResolvedValueOnce(false)

    const { result } = renderHook(() =>
      useNFTCard({ nft: nftMock, saleButton: false })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    const { updateSale } = result.current

    await act(async () => {
      await updateSale()
    })

    expect(result.current.isFetching).toBeFalsy()
    expect(result.current.sale).toBe(saleMock)
    expect(result.current.updateSale).toBeDefined()
  })

  test('return if userAddress or blockchainNetworkId is undefined', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(CheckImageSrc as jest.Mock).mockResolvedValueOnce(false)
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: {
        sale: null,
      },
    })
    renderHook(() => useNFTCard({ nft: nftMock, saleButton: true }))

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(handlerQueryErrorCatch).toBeCalledTimes(0)
  })
})
