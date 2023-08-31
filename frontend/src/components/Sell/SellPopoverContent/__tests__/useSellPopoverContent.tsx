import { act, renderHook } from '@testing-library/react'
import { useUserContext } from '../../../../context/userContext'
import {
  askApproval,
  createSale,
  waitTransaction,
} from '../../../../services/BlockchainService'
import useSellPopoverContent from '../useSellPopoverContent'
import { handlerQueryErrorCatch } from '../../../../services/BackendService'
import { useToast } from '@chakra-ui/react'

jest.mock('../../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

jest.mock('../../../../services/BackendService', () => ({
  handlerQueryErrorCatch: jest.fn(),
  isMarketplaceApprovedQuery: jest.fn(),
}))

jest.mock('../../../../services/BlockchainService', () => ({
  askApproval: jest.fn(),
  waitTransaction: jest.fn(),
  createSale: jest.fn(),
}))

jest.mock('../../../../hooks/useLoading', () => () => ({
  isLoading: false,
  setIsLoading: jest.fn(),
}))

jest.mock('../../../../hooks/useFetching', () => () => ({
  isFetching: false,
  setIsFetching: jest.fn(),
  isError: false,
  setIsError: jest.fn(),
}))

jest.mock('@chakra-ui/react', () => ({
  useToast: jest.fn(),
}))

const mockProps = {
  nft: {
    contractAddress: '0x0000000000',
    tokenId: 0,
    image:
      'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q',
    name: 'Test NFT',
  },
  onClose: jest.fn(),
}

describe('useSellPopoverContent', () => {
  test('fetching error', async () => {
    ;(askApproval as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      error: true,
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })

    const { result } = renderHook(() =>
      useSellPopoverContent({
        nft: mockProps.nft,
        onClose: mockProps.onClose,
        onSucess: jest.fn(),
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(result.current.isFetching).toBe(false)
  })

  test('approve function works as expected', async () => {
    ;(askApproval as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        isMarketplaceApproved: true,
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })

    const { result } = renderHook(() =>
      useSellPopoverContent({
        nft: mockProps.nft,
        onClose: mockProps.onClose,
        onSucess: jest.fn(),
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    const { approve } = result.current

    await act(async () => {
      await approve()
    })

    expect(askApproval).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(1)
  })

  test('approve function fails', async () => {
    ;(askApproval as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        isMarketplaceApproved: true,
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() =>
      useSellPopoverContent({
        nft: mockProps.nft,
        onClose: mockProps.onClose,
        onSucess: jest.fn(),
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    const { approve } = result.current

    await act(async () => {
      await approve()
    })

    expect(askApproval).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('approve return is user and network are not defined', async () => {
    // Mocking necessary functions

    ;(askApproval as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        isMarketplaceApproved: true,
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: undefined,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() =>
      useSellPopoverContent({
        nft: mockProps.nft,
        onClose: mockProps.onClose,
        onSucess: jest.fn(),
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    const { approve } = result.current

    await act(async () => {
      await approve()
    })

    expect(askApproval).toHaveBeenCalledTimes(0)
  })

  test('sell function works as expected', async () => {
    ;(createSale as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        isMarketplaceApproved: true,
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })

    const { result } = renderHook(() =>
      useSellPopoverContent({
        nft: mockProps.nft,
        onClose: mockProps.onClose,
        onSucess: jest.fn(),
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    const { sell } = result.current

    await act(async () => {
      await sell()
    })

    expect(createSale).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(1)
  })

  test('sell function fails', async () => {
    ;(createSale as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        isMarketplaceApproved: true,
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() =>
      useSellPopoverContent({
        nft: mockProps.nft,
        onClose: mockProps.onClose,
        onSucess: jest.fn(),
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    const { sell } = result.current

    await act(async () => {
      await sell()
    })

    expect(createSale).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('sell return is user and network are not defined', async () => {
    // Mocking necessary functions

    ;(createSale as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        isMarketplaceApproved: true,
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: undefined,
    })
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue(mockToast)

    const { result } = renderHook(() =>
      useSellPopoverContent({
        nft: mockProps.nft,
        onClose: mockProps.onClose,
        onSucess: jest.fn(),
      })
    )

    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    const { sell } = result.current

    await act(async () => {
      await sell()
    })

    expect(createSale).toHaveBeenCalledTimes(0)
  })
})
