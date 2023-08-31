import { act, renderHook } from '@testing-library/react'

import useNFTRoyalties from '../useNFTRoyalties'
import { useUserContext } from '../../../context/userContext'
import { handlerQueryErrorCatch } from '../../../services/BackendService'
import {
  updateTokenRoyalties,
  waitTransaction,
  resetTokenRoyalty,
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
  updateTokenRoyalties: jest.fn(),
  resetTokenRoyalty: jest.fn(),
  waitTransaction: jest.fn(),
}))

jest.mock('../../../services/BackendService', () => ({
  NFTRoyaltyQuery: jest.fn(),
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

describe('useNFTRoyalties', () => {
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
        nftComplete: {
          nft: {
            name: 'TokenName',
            image: 'TokenImage',
            contractAddress: 'TokenContractAddress',
            tokenId: 0,
          },
        },
        royaltyToken: {
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

    const { result } = renderHook(() =>
      useNFTRoyalties({ address: 'mockedAddress', tokenId: 0 })
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.nft).toEqual({
      name: 'TokenName',
      image: 'TokenImage',
      contractAddress: 'TokenContractAddress',
      tokenId: 0,
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
        nftComplete: {
          nft: {
            name: 'TokenName',
            image: 'TokenImage',
            contractAddress: 'TokenContractAddress',
            tokenId: 0,
          },
        },
        royaltyToken: {
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

    const { result } = renderHook(() =>
      useNFTRoyalties({ address: 'mockedAddress', tokenId: 0 })
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.nft).toEqual(undefined)

    expect(result.current.royalties).toEqual(undefined)
  })

  test('fetcing return if user undefined', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      error: true,
      result: {
        nftComplete: {
          nft: {
            name: 'TokenName',
            image: 'TokenImage',
            contractAddress: 'TokenContractAddress',
            tokenId: 0,
          },
        },
        royaltyToken: {
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

    renderHook(() => useNFTRoyalties({ address: 'mockedAddress', tokenId: 0 }))

    await act(async () => {
      await Promise.resolve()
    })

    expect(handlerQueryErrorCatch).not.toHaveBeenCalled()
  })

  test('handle submit', async () => {
    ;(updateTokenRoyalties as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      error: true,
      result: {
        nftComplete: {
          nft: {
            name: 'TokenName',
            image: 'TokenImage',
            contractAddress: 'TokenContractAddress',
            tokenId: 0,
          },
        },
        royaltyToken: {
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

    const { result } = renderHook(() =>
      useNFTRoyalties({ address: 'mockedAddress', tokenId: 0 })
    )

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

      expect(updateTokenRoyalties).toHaveBeenCalledTimes(1)
      expect(waitTransaction).toHaveBeenCalledTimes(1)
    })
  })

  test('handle submit error', async () => {
    ;(updateTokenRoyalties as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      error: true,
      result: {
        nftComplete: {
          nft: {
            name: 'TokenName',
            image: 'TokenImage',
            contractAddress: 'TokenContractAddress',
            tokenId: 0,
          },
        },
        royaltyToken: {
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

    const { result } = renderHook(() =>
      useNFTRoyalties({ address: 'mockedAddress', tokenId: 0 })
    )

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

      expect(updateTokenRoyalties).toHaveBeenCalledTimes(1)
      expect(waitTransaction).toHaveBeenCalledTimes(0)
    })
  })

  test('handle remove custon', async () => {
    ;(resetTokenRoyalty as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      error: true,
      result: {
        nftComplete: {
          nft: {
            name: 'TokenName',
            image: 'TokenImage',
            contractAddress: 'TokenContractAddress',
            tokenId: 0,
          },
        },
        royaltyToken: {
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

    const { result } = renderHook(() =>
      useNFTRoyalties({ address: 'mockedAddress', tokenId: 0 })
    )

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.handleRemoveCustom()
      expect(resetTokenRoyalty).toHaveBeenCalledTimes(1)
      expect(waitTransaction).toHaveBeenCalledTimes(1)
    })
  })

  test('handle remove custon error', async () => {
    ;(resetTokenRoyalty as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      error: true,
      result: {
        nftComplete: {
          nft: {
            name: 'TokenName',
            image: 'TokenImage',
            contractAddress: 'TokenContractAddress',
            tokenId: 0,
          },
        },
        royaltyToken: {
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

    const { result } = renderHook(() =>
      useNFTRoyalties({ address: 'mockedAddress', tokenId: 0 })
    )

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.handleRemoveCustom()

      expect(resetTokenRoyalty).toHaveBeenCalledTimes(1)
      expect(waitTransaction).toHaveBeenCalledTimes(0)
    })
  })
})
