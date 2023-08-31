import React from 'react'
import { render, act } from '@testing-library/react'
import NFTOperations from '../NFTOperations'
import { SaleStatus } from '../../../types/components/SaleStatus'
import { useUserContext } from '../../../context/userContext'

jest.mock('../../Sell/SellOrIsForSale/SellOrIsForSale')

jest.mock('../../../utils/CollectionOwnerCheck/CollectionOwnerCheck', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="CollectionOwnerCheck">{children}</div>
  ),
}))

jest.mock('../../WithdrawRoyaltyButton/WithdrawRoyaltyButton')
jest.mock('../../CancelSale/CancelSaleManager/CancelSaleManager')
jest.mock('../../ModifySale/ModifySaleManager/ModifySaleManager')
jest.mock('../../Buy/BuyManager/BuyManager')
jest.mock('../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

const mockProps = {
  nft: {
    contractAddress: '0x0000000000',
    tokenId: 0,
    image:
      'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q',
    name: 'Test NFT',
  },
  sale: {
    nftData: {
      contractAddress: '0x0000000000',
      tokenId: 0,
      image:
        'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q',
      name: 'Test NFT',
    },
    seller: '0x12345',
    price: 0,
    status: SaleStatus.LISTED,
  },
  owner: '0x12345',
  onUpdate: jest.fn(),
}
describe('NFTOperations', () => {
  test('renders correctly, owner and listed', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
    })

    const tree = render(<NFTOperations {...mockProps} />)
    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(tree.container).toMatchSnapshot()

    // owner an listed
    expect(tree.getByTestId('SellOrIsForSale')).toBeInTheDocument()
    expect(tree.getByTestId('CancelSaleManager')).toBeInTheDocument()
    expect(tree.getByTestId('ModifySaleManager')).toBeInTheDocument()
    expect(tree.queryByTestId('BuyManager')).not.toBeInTheDocument()
  })

  test('renders correctly, possible buyer', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x54321',
    })

    const tree = render(<NFTOperations {...mockProps} />)
    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(tree.container).toMatchSnapshot()

    // possible buyer
    expect(tree.getByTestId('BuyManager')).toBeInTheDocument()
    expect(tree.queryByTestId('SellOrIsForSale')).not.toBeInTheDocument()
    expect(tree.queryByTestId('CancelSaleManager')).not.toBeInTheDocument()
    expect(tree.queryByTestId('ModifySaleManager')).not.toBeInTheDocument()
  })

  test('renders correctly, account disconnected', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: null,
    })

    const tree = render(<NFTOperations {...mockProps} />)
    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    expect(tree.container).toMatchSnapshot()

    // possible buyer
    expect(tree.queryByTestId('BuyManager')).not.toBeInTheDocument()
    expect(tree.queryByTestId('SellOrIsForSale')).not.toBeInTheDocument()
    expect(tree.queryByTestId('CancelSaleManager')).not.toBeInTheDocument()
    expect(tree.queryByTestId('ModifySaleManager')).not.toBeInTheDocument()
  })

  test('calls navigate when clicking on Modify Token Royalties', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
    })

    const tree = render(<NFTOperations {...mockProps} />)
    await act(async () => {
      await Promise.resolve() // Wait for state update
    })

    const modifyTokenRoyalties = tree.getByText('Modify Token Royalties')
    expect(modifyTokenRoyalties).toBeInTheDocument()
    modifyTokenRoyalties.click()
    expect(mockNavigate).toHaveBeenCalledWith('/0x0000000000/0/royalties')
  })
})
