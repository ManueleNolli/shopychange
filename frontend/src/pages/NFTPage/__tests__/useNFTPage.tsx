import { renderHook, act } from '@testing-library/react'
import useNFTPage from '../useNFTPage'
import { useUserContext } from '../../../context/userContext'
import { handlerQueryErrorCatch } from '../../../services/BackendService'
import CheckImageSrc from '../../../utils/CheckImageSrc/CheckImageSrc'

jest.mock('../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

jest.mock('../../../services/BackendService', () => ({
  nftCompleteQuery: jest.fn(),
  saleQuery: jest.fn(),
  nftHistoryQuery: jest.fn(),
  handlerQueryErrorCatch: jest.fn(),
}))

jest.mock('../../../hooks/useFetching', () => () => ({
  isFetching: false,
  setIsFetching: jest.fn(),
  isError: false,
  setIsError: jest.fn(),
}))

jest.mock('../../../utils/CheckImageSrc/CheckImageSrc', () => jest.fn())

const mockedData = {
  nftComplete: {
    nft: {
      contractAddress: 'mockedContractAddress',
      tokenId: 0,
      image: 'mockedImage',
      name: 'mockedName',
    },
    description: 'mockedDescription',
    contract: {
      name: 'mockedContractName',
      symbol: 'mockedContractSymbol',
      address: 'mockedContractAddress',
    },
    attributes: [
      {
        traitType: 'mockedTraitType',
        value: 'mockedValue',
      },
    ],
  },
  sale: {
    nftData: {
      contractAddress: 'mockedContractAddress',
      tokenId: 0,
      image: 'mockedImage',
      name: 'mockedName',
    },
    seller: 'mockedSeller',
    price: 0,
    status: 0,
  },
  nftHistory: [],
}

describe('useNFTPage', () => {
  test('fetching', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(CheckImageSrc as jest.Mock).mockResolvedValueOnce(true)
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: {
        nftComplete: mockedData.nftComplete,
        sale: mockedData.sale,
        nftHistory: mockedData.nftHistory,
      },
      error: false,
    })

    const { result } = renderHook(() =>
      useNFTPage({
        contractAddress: 'mockedContractAddress',
        tokenId: 0,
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(result.current.nftComplete).toEqual(mockedData.nftComplete)
    expect(result.current.sale).toEqual(mockedData.sale)
    expect(result.current.history).toEqual(mockedData.nftHistory)
  })

  test('fetching nftcomplete error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock)
      .mockResolvedValueOnce({
        result: {
          nftComplete: mockedData.nftComplete,
          sale: mockedData.sale,
          nftHistory: mockedData.nftHistory,
        },
        error: true,
      })
      .mockResolvedValue({
        result: {
          sale: mockedData.sale,
          nftHistory: mockedData.nftHistory,
        },
        error: false,
      })

    const { result } = renderHook(() =>
      useNFTPage({
        contractAddress: 'mockedContractAddress',
        tokenId: 0,
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(result.current.nftComplete).toEqual({
      nft: {
        name: '',
        image: '',
        contractAddress: '',
        tokenId: 0,
      },
      owner: '',
      description: '',
      attributes: [],
      contract: {
        name: '',
        symbol: '',
        address: '',
      },
      tokenType: '',
    })
    expect(result.current.sale).toEqual(mockedData.sale)
    expect(result.current.history).toEqual(mockedData.nftHistory)
  })

  test('fetching  return', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: {
        nftComplete: mockedData.nftComplete,
        sale: mockedData.sale,
        nftHistory: mockedData.nftHistory,
      },
      error: false,
    })

    const { result } = renderHook(() =>
      useNFTPage({
        contractAddress: 'mockedContractAddress',
        tokenId: 0,
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(result.current.nftComplete).toEqual({
      nft: {
        name: '',
        image: '',
        contractAddress: '',
        tokenId: 0,
      },
      owner: '',
      description: '',
      attributes: [],
      contract: {
        name: '',
        symbol: '',
        address: '',
      },
      tokenType: '',
    })
    expect(result.current.sale).toEqual(null)
    expect(result.current.history).toEqual([])
  })

  test('fetching NFTComplete error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock)
      .mockResolvedValueOnce({
        result: {
          nftComplete: mockedData.nftComplete,
          sale: mockedData.sale,
          nftHistory: mockedData.nftHistory,
        },
        error: false,
      })
      .mockResolvedValueOnce({
        result: {
          nftComplete: mockedData.nftComplete,
          nftHistory: mockedData.nftHistory,
        },
        error: true,
      })
      .mockResolvedValue({
        result: {
          sale: mockedData.sale,
          nftHistory: mockedData.nftHistory,
        },
        error: false,
      })

    const { result } = renderHook(() =>
      useNFTPage({
        contractAddress: 'mockedContractAddress',
        tokenId: 0,
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(result.current.nftComplete).toEqual(mockedData.nftComplete)
    expect(result.current.sale).toEqual(null)
    expect(result.current.history).toEqual(mockedData.nftHistory)
  })

  test('fetching history error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock)
      .mockResolvedValueOnce({
        result: {
          nftComplete: mockedData.nftComplete,
          sale: mockedData.sale,
          nftHistory: mockedData.nftHistory,
        },
        error: false,
      })
      .mockResolvedValueOnce({
        result: {
          nftComplete: mockedData.nftComplete,
          nftHistory: mockedData.nftHistory,
          sale: mockedData.sale,
        },
        error: false,
      })
      .mockResolvedValue({
        result: {
          sale: mockedData.sale,
          nftHistory: mockedData.nftHistory,
        },
        error: true,
      })

    const { result } = renderHook(() =>
      useNFTPage({
        contractAddress: 'mockedContractAddress',
        tokenId: 0,
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(result.current.nftComplete).toEqual(mockedData.nftComplete)
    expect(result.current.sale).toEqual(mockedData.sale)
    expect(result.current.history).toEqual([])
  })

  test('updateAll', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: {
        nftComplete: mockedData.nftComplete,
        sale: mockedData.sale,
        nftHistory: mockedData.nftHistory,
      },
      error: false,
    })

    const { result } = renderHook(() =>
      useNFTPage({
        contractAddress: 'mockedContractAddress',
        tokenId: 0,
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    await act(async () => {
      result.current.updateAll()
    })

    expect(handlerQueryErrorCatch).toBeCalledTimes(6)
  })
})
