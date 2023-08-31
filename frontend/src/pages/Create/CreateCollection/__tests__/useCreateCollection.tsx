import { renderHook, act } from '@testing-library/react'
import useCreateCollection from '../useCreateCollection'
import { handlerMutation } from '../../../../services/BackendService'
import { useUserContext } from '../../../../context/userContext'
import {
  createNewERC721Contract,
  waitTransaction,
} from '../../../../services/BlockchainService'
import { uploadCollection } from '../../../../services/IPFSService'
import { useToast } from '@chakra-ui/react'
jest.useFakeTimers()

jest.mock('../../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

jest.mock('../../../../services/BlockchainService', () => ({
  createNewERC721Contract: jest.fn(),
  waitTransaction: jest.fn(),
}))

jest.mock('../../../../services/IPFSService', () => ({
  uploadCollection: jest.fn(),
}))

jest.mock('../../../../services/BackendService', () => ({
  ownedERC721ContractQuery: jest.fn(),
  handlerMutation: jest.fn(),
  AddNFTCollectionsMutation: jest.fn(),
  handlerQueryErrorCatch: jest.fn(),
}))

jest.mock('@chakra-ui/react', () => ({
  useToast: jest.fn(),
}))

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('useCreateCollection', () => {
  test('handle submit', async () => {
    ;(uploadCollection as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(createNewERC721Contract as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerMutation as jest.Mock).mockReturnValueOnce({
      result: {},
    })

    const { result } = renderHook(() => useCreateCollection())

    await act(async () => {
      await result.current.handleSubmit({
        name: 'name',
        symbol: 'symbol',
        royalties: [
          {
            receiver: 'receiver',
            share: 1,
          },
        ],
        nfts: [
          {
            name: 'name',
            description: 'description',
            image: new File([''], 'filename'),
            attributes: [
              {
                trait_type: 'trait_type',
                value: 'value',
              },
            ],
          },
        ],
      })
    })

    expect(uploadCollection).toHaveBeenCalledTimes(1)
    expect(createNewERC721Contract).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(1)
    expect(handlerMutation).toHaveBeenCalledTimes(1)
  })

  test('handle submit error', async () => {
    ;(uploadCollection as jest.Mock).mockRejectedValueOnce({
      message: 'error',
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValueOnce(mockToast)
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(createNewERC721Contract as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerMutation as jest.Mock).mockReturnValueOnce({
      result: {},
    })

    const { result } = renderHook(() => useCreateCollection())

    await act(async () => {
      await result.current.handleSubmit({
        name: 'name',
        symbol: 'symbol',
        royalties: [
          {
            receiver: 'receiver',
            share: 1,
          },
        ],
        nfts: [
          {
            name: 'name',
            description: 'description',
            image: new File([''], 'filename'),
            attributes: [
              {
                trait_type: 'trait_type',
                value: 'value',
              },
            ],
          },
        ],
      })
    })

    expect(uploadCollection).toHaveBeenCalledTimes(1)
    expect(createNewERC721Contract).toHaveBeenCalledTimes(0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
    expect(handlerMutation).toHaveBeenCalledTimes(0)
  })

  test('handle submit error createNewERC721Contract', async () => {
    ;(createNewERC721Contract as jest.Mock).mockRejectedValueOnce({
      message: 'error',
    })
    ;(uploadCollection as jest.Mock).mockResolvedValueOnce({})
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValueOnce(mockToast)
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerMutation as jest.Mock).mockReturnValueOnce({
      result: {},
    })

    const { result } = renderHook(() => useCreateCollection())

    await act(async () => {
      await result.current.handleSubmit({
        name: 'name',
        symbol: 'symbol',
        royalties: [
          {
            receiver: 'receiver',
            share: 1,
          },
        ],
        nfts: [
          {
            name: 'name',
            description: 'description',
            image: new File([''], 'filename'),
            attributes: [
              {
                trait_type: 'trait_type',
                value: 'value',
              },
            ],
          },
        ],
      })
    })

    expect(uploadCollection).toHaveBeenCalledTimes(1)
    expect(createNewERC721Contract).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
    expect(handlerMutation).toHaveBeenCalledTimes(0)
  })

  test('handle submit return if user not defined', async () => {
    ;(uploadCollection as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(createNewERC721Contract as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerMutation as jest.Mock).mockReturnValueOnce({
      result: {},
    })

    const { result } = renderHook(() => useCreateCollection())

    await act(async () => {
      await result.current.handleSubmit({
        name: 'name',
        symbol: 'symbol',
        royalties: [
          {
            receiver: 'receiver',
            share: 1,
          },
        ],
        nfts: [
          {
            name: 'name',
            description: 'description',
            image: new File([''], 'filename'),
            attributes: [
              {
                trait_type: 'trait_type',
                value: 'value',
              },
            ],
          },
        ],
      })
    })

    expect(uploadCollection).toHaveBeenCalledTimes(0)
    expect(createNewERC721Contract).toHaveBeenCalledTimes(0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
    expect(handlerMutation).toHaveBeenCalledTimes(0)
  })

  test('handle submit return if zero nft', async () => {
    ;(uploadCollection as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(createNewERC721Contract as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x000001',
      blockchainNetworkId: 1,
    })
    ;(handlerMutation as jest.Mock).mockReturnValueOnce({
      result: {},
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValueOnce(mockToast)

    const { result } = renderHook(() => useCreateCollection())

    await act(async () => {
      await result.current.handleSubmit({
        name: 'name',
        symbol: 'symbol',
        royalties: [
          {
            receiver: 'receiver',
            share: 1,
          },
        ],
        nfts: [],
      })
    })

    expect(uploadCollection).toHaveBeenCalledTimes(0)
    expect(createNewERC721Contract).toHaveBeenCalledTimes(0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
    expect(handlerMutation).toHaveBeenCalledTimes(0)
  })
})
