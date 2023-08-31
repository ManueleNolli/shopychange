import { renderHook, act } from '@testing-library/react'
import useCreateSingleToken from '../useCreateSingleToken'
import {
  handlerMutation,
  handlerQueryErrorCatch,
} from '../../../../services/BackendService'
import { useUserContext } from '../../../../context/userContext'
import {
  mintNewSingleToken,
  storageAddress,
  waitTransaction,
} from '../../../../services/BlockchainService'
import { uploadNFT } from '../../../../services/IPFSService'
import { useToast } from '@chakra-ui/react'

jest.mock('../../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

jest.mock('../../../../services/BlockchainService', () => ({
  storageAddress: jest.fn(),
  mintNewSingleToken: jest.fn(),
  waitTransaction: jest.fn(),
}))

jest.mock('../../../../services/IPFSService', () => ({
  uploadNFT: jest.fn(),
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

describe('useCreateSingleToken', () => {
  test('fetching', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      result: {
        contractOwnedCreatedWithShopychange: [
          {
            name: 'Contract',
            symbol: 'symbol',
            address: 'mockedAddress',
          },
        ],
      },
    })
    ;(storageAddress as jest.Mock).mockReturnValueOnce('mockedAddress')

    const { result } = renderHook(() => useCreateSingleToken())

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.contracts).toEqual([
      {
        name: 'Shopychange Storage',
        symbol: 'SCS',
        address: 'mockedAddress',
      },
      {
        name: 'Contract',
        symbol: 'symbol',
        address: 'mockedAddress',
      },
    ])
  })

  test('fetching return if user undefined', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      result: {
        contractOwnedCreatedWithShopychange: [
          {
            name: 'Contract',
            symbol: 'symbol',
            address: 'mockedAddress',
          },
        ],
      },
    })
    ;(storageAddress as jest.Mock).mockReturnValueOnce('mockedAddress')

    const { result } = renderHook(() => useCreateSingleToken())

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.contracts).toEqual([])
  })

  test('fetching error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      error: true,
      result: {
        contractOwnedCreatedWithShopychange: [
          {
            name: 'Contract',
            symbol: 'symbol',
            address: 'mockedAddress',
          },
        ],
      },
    })
    ;(storageAddress as jest.Mock).mockReturnValueOnce('mockedAddress')

    const { result } = renderHook(() => useCreateSingleToken())

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.contracts).toEqual([
      {
        name: 'Shopychange Storage',
        symbol: 'SCS',
        address: 'mockedAddress',
      },
    ])
  })

  test('storage address undefined', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      result: {
        contractOwnedCreatedWithShopychange: [
          {
            name: 'Contract',
            symbol: 'symbol',
            address: 'mockedAddress',
          },
        ],
      },
    })
    ;(storageAddress as jest.Mock).mockReturnValueOnce(undefined)

    const { result } = renderHook(() => useCreateSingleToken())

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.contracts).toEqual([])
  })

  test('handle submit', async () => {
    ;(uploadNFT as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(mintNewSingleToken as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      result: {
        contractOwnedCreatedWithShopychange: [
          {
            name: 'Contract',
            symbol: 'symbol',
            address: 'mockedAddress',
          },
        ],
      },
    })
    ;(handlerMutation as jest.Mock).mockReturnValueOnce({
      result: {},
    })
    ;(storageAddress as jest.Mock).mockReturnValueOnce(undefined)

    const { result } = renderHook(() => useCreateSingleToken())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.handleSubmit({
        name: 'name',
        description: 'description',
        image: new File([''], 'filename'),
        attributes: [
          {
            trait_type: 'trait_type',
            value: 'value',
          },
        ],
        contractAddress: 'contractAddress',
        royalties: [
          {
            receiver: 'receiver',
            share: 1,
          },
        ],
        useDefaultRoyalties: false,
      })
    })

    expect(uploadNFT).toHaveBeenCalledTimes(1)
    expect(mintNewSingleToken).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(1)
    expect(handlerMutation).toHaveBeenCalledTimes(1)
  })

  test('handle submit return if user undefined', async () => {
    ;(uploadNFT as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(mintNewSingleToken as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      result: {
        contractOwnedCreatedWithShopychange: [
          {
            name: 'Contract',
            symbol: 'symbol',
            address: 'mockedAddress',
          },
        ],
      },
    })
    ;(handlerMutation as jest.Mock).mockReturnValueOnce({
      result: {},
    })
    ;(storageAddress as jest.Mock).mockReturnValueOnce(undefined)

    const { result } = renderHook(() => useCreateSingleToken())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.handleSubmit({
        name: 'name',
        description: 'description',
        image: new File([''], 'filename'),
        attributes: [
          {
            trait_type: 'trait_type',
            value: 'value',
          },
        ],
        contractAddress: 'contractAddress',
        royalties: [
          {
            receiver: 'receiver',
            share: 1,
          },
        ],
        useDefaultRoyalties: false,
      })
    })

    expect(uploadNFT).toHaveBeenCalledTimes(0)
    expect(mintNewSingleToken).toHaveBeenCalledTimes(0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
    expect(handlerMutation).toHaveBeenCalledTimes(0)
  })

  test('handle submit error', async () => {
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValueOnce(mockToast)
    ;(uploadNFT as jest.Mock).mockRejectedValue({
      message: 'error',
    })
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(mintNewSingleToken as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      result: {
        contractOwnedCreatedWithShopychange: [
          {
            name: 'Contract',
            symbol: 'symbol',
            address: 'mockedAddress',
          },
        ],
      },
    })
    ;(handlerMutation as jest.Mock).mockReturnValueOnce({
      result: {},
    })
    ;(storageAddress as jest.Mock).mockReturnValueOnce(undefined)

    const { result } = renderHook(() => useCreateSingleToken())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.handleSubmit({
        name: 'name',
        description: 'description',
        image: new File([''], 'filename'),
        attributes: [
          {
            trait_type: 'trait_type',
            value: 'value',
          },
        ],
        contractAddress: 'contractAddress',
        royalties: [
          {
            receiver: 'receiver',
            share: 1,
          },
        ],
        useDefaultRoyalties: false,
      })
    })

    expect(uploadNFT).toHaveBeenCalledTimes(1)
    expect(mintNewSingleToken).toHaveBeenCalledTimes(0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
    expect(handlerMutation).toHaveBeenCalledTimes(0)
  })

  test('handle submit error', async () => {
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValueOnce(mockToast)
    ;(uploadNFT as jest.Mock).mockResolvedValueOnce({})
    ;(mintNewSingleToken as jest.Mock).mockRejectedValue({
      message: 'error',
    })
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockReturnValueOnce({
      result: {
        contractOwnedCreatedWithShopychange: [
          {
            name: 'Contract',
            symbol: 'symbol',
            address: 'mockedAddress',
          },
        ],
      },
    })
    ;(handlerMutation as jest.Mock).mockReturnValueOnce({
      result: {},
    })
    ;(storageAddress as jest.Mock).mockReturnValueOnce(undefined)

    const { result } = renderHook(() => useCreateSingleToken())

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.handleSubmit({
        name: 'name',
        description: 'description',
        image: new File([''], 'filename'),
        attributes: [
          {
            trait_type: 'trait_type',
            value: 'value',
          },
        ],
        contractAddress: 'contractAddress',
        royalties: [
          {
            receiver: 'receiver',
            share: 1,
          },
        ],
        useDefaultRoyalties: false,
      })
    })

    expect(uploadNFT).toHaveBeenCalledTimes(1)
    expect(mintNewSingleToken).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
    expect(handlerMutation).toHaveBeenCalledTimes(0)
  })
})
