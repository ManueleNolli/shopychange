import {
  cancelSale,
  waitTransaction,
} from '../../../../services/BlockchainService'
import useCancelSalePopoverContent from '../useCancelSalePopoverContent'
import { useToast } from '@chakra-ui/react'
import { useUserContext } from '../../../../context/userContext'

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

jest.mock('../../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

jest.mock('../../../../hooks/useLoading', () => () => ({
  isLoading: false,
  setIsLoading: jest.fn(),
}))

jest.mock('../../../../services/BlockchainService', () => ({
  cancelSale: jest.fn(),
  waitTransaction: jest.fn(),
}))

jest.mock('@chakra-ui/react', () => ({
  useToast: jest.fn(),
}))

describe('useCancelSalePopoverContent', () => {
  beforeEach(() => {
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValueOnce(mockToast)
  })

  test('cancelSale function works as expected', async () => {
    // Mocking necessary functions
    ;(cancelSale as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValueOnce({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })

    const onClose = jest.fn()
    const onSuccess = jest.fn()

    const { cancel } = useCancelSalePopoverContent({
      nft: mockProps.nft,
      onClose,
      onSuccess,
    })

    await cancel()

    // Perform assertions
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(cancelSale).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(1)
  })

  test('cancelSale function fails', async () => {
    // Mocking necessary functions
    ;(cancelSale as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValueOnce({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })

    const onClose = jest.fn()
    const onSuccess = jest.fn()

    const { cancel } = useCancelSalePopoverContent({
      nft: mockProps.nft,
      onClose,
      onSuccess,
    })

    await cancel()

    // Perform assertions
    expect(onClose).toHaveBeenCalledTimes(0)
    expect(onSuccess).toHaveBeenCalledTimes(0)
    expect(cancelSale).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })

  test('return is user and network are not defined', async () => {
    // Mocking necessary functions
    ;(cancelSale as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValueOnce({
      userAddress: undefined,
      blockchainNetworkId: undefined,
    })

    const onClose = jest.fn()
    const onSuccess = jest.fn()

    const { cancel } = useCancelSalePopoverContent({
      nft: mockProps.nft,
      onClose,
      onSuccess,
    })

    await cancel()

    // Perform assertions
    expect(cancelSale).toHaveBeenCalledTimes(0)
  })
})
