import { act, renderHook } from '@testing-library/react'
import useCollectionGrid from '../useCollectionGrid'
import { handlerQueryErrorCatch } from '../../../services/BackendService'
import { useUserContext } from '../../../context/userContext'

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
  contractQuery: jest.fn(),
  handlerQueryErrorCatch: jest.fn(),
}))

const mockData = [
  {
    contractAddress: '0x0000000000',
    tokenId: 0,
    image:
      'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q/0.png',
    name: 'Test NFT',
  },
  {
    contractAddress: '0x0000000000',
    tokenId: 1,
    image:
      'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q/1.png',
    name: 'Test NFT 1',
  },
]

describe('useCollectionGrid', () => {
  test('Should fetch contract metadata for each contract address', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        contract: {
          address: '0x0000000000',
          name: 'Test Contract',
          symbol: 'TEST',
        },
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })

    const { result } = renderHook(() => useCollectionGrid({ nfts: mockData }))

    await act(async () => {
      result.current
    })

    expect(result.current.collections).toEqual([
      {
        contract: {
          address: '0x0000000000',
          name: 'Test Contract',
          symbol: 'TEST',
        },
        nfts: [mockData[0], mockData[1]],
      },
    ])
  })
  test('error during fetch', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      error: true,
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })

    const { result } = renderHook(() => useCollectionGrid({ nfts: mockData }))

    await act(async () => {
      result.current
    })

    expect(result.current.collections).toEqual([])
  })

  test('Should return empty collections if userAddress or blockchainNetworkId is undefined', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        contract: {
          address: '0x0000000000',
          name: 'Test Contract',
          symbol: 'TEST',
        },
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })

    const { result } = renderHook(() => useCollectionGrid({ nfts: mockData }))
    await act(async () => {
      result.current
    })

    expect(result.current.collections).toEqual([])
  })
})
