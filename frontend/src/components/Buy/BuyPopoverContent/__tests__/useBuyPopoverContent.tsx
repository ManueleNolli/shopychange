import { buy, waitTransaction } from '../../../../services/BlockchainService'
import useBuyPopoverContent from '../useBuyPopoverContent'
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
  price: 0.4,
}

jest.mock('../../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

jest.mock('../../../../hooks/useLoading', () => () => ({
  isLoading: false,
  setIsLoading: jest.fn(),
}))

jest.mock('../../../../services/BlockchainService', () => ({
  buy: jest.fn(),
  waitTransaction: jest.fn(),
}))

jest.mock('../../../../services/BackendService', () => ({
  handlerMutation: jest.fn(),
  AddNFTCollectionsMutation: jest.fn(),
}))

jest.mock('@chakra-ui/react', () => ({
  useToast: jest.fn(),
}))

describe('useBuyPopoverContent', () => {
  beforeEach(() => {
    const mockToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValueOnce(mockToast)
  })

  test('buyToken function works as expected', async () => {
    // Mocking necessary functions
    ;(buy as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValueOnce({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })

    const onClose = jest.fn()
    const onSuccess = jest.fn()

    const { buyToken } = useBuyPopoverContent({
      nft: mockProps.nft,
      price: mockProps.price,
      onClose,
      onSuccess,
    })

    await buyToken()

    // Perform assertions
    expect(buy).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('buyToken function works as expected when buy fails', async () => {
    // Mocking necessary functions
    ;(buy as jest.Mock).mockRejectedValueOnce({
      message: 'Error message',
    })
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValueOnce({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })

    const onClose = jest.fn()
    const onSuccess = jest.fn()

    const { buyToken, isLoading } = useBuyPopoverContent({
      nft: mockProps.nft,
      price: mockProps.price,
      onClose,
      onSuccess,
    })

    await buyToken()

    // Perform assertions
    expect(buy).toHaveBeenCalledTimes(1)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
    expect(onSuccess).toHaveBeenCalledTimes(0)
    expect(onClose).toHaveBeenCalledTimes(0)
    expect(isLoading).toBe(false)
  })

  test('return is user and network are not defined', async () => {
    // Mocking necessary functions
    ;(buy as jest.Mock).mockResolvedValueOnce({})
    ;(waitTransaction as jest.Mock).mockResolvedValueOnce({})
    ;(useUserContext as jest.Mock).mockReturnValueOnce({
      userAddress: undefined,
      blockchainNetworkId: undefined,
    })

    const onClose = jest.fn()
    const onSuccess = jest.fn()

    const { buyToken } = useBuyPopoverContent({
      nft: mockProps.nft,
      price: mockProps.price,
      onClose,
      onSuccess,
    })

    await buyToken()

    // Perform assertions
    expect(buy).toHaveBeenCalledTimes(0)
    expect(waitTransaction).toHaveBeenCalledTimes(0)
  })
})
