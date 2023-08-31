import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SellPopoverContent from '../SellPopoverContent'
import useSellPopoverContent from '../useSellPopoverContent'

jest.mock('@chakra-ui/react', () => {
  const originalChakraUI = jest.requireActual('@chakra-ui/react')
  return {
    ...originalChakraUI,
    ModalContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="ModalContent">{children}</div>
    ),
  }
})

jest.mock('../useSellPopoverContent', () => jest.fn())
jest.mock('../../../PriceDistribition/PriceDistribution')

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

const onUpdate = jest.fn()

describe('SellPopoverContent', () => {
  test('renders correctly isApproved = true', () => {
    ;(useSellPopoverContent as jest.Mock).mockReturnValueOnce({
      isApproved: true,
      isLoading: false,
      price: 0,
      setPrice: jest.fn(),
      approve: jest.fn(),
      sell: jest.fn(),
      isFetching: false,
      isError: false,
    })

    const tree = render(
      <SellPopoverContent
        nft={mockProps.nft}
        onClose={mockProps.onClose}
        onSucess={onUpdate}
      />
    )

    expect(tree.container).toMatchSnapshot()
  })

  test('renders correctly isApproved = false', () => {
    ;(useSellPopoverContent as jest.Mock).mockReturnValueOnce({
      isApproved: false,
      isLoading: false,
      price: 0,
      setPrice: jest.fn(),
      approve: jest.fn(),
      sell: jest.fn(),
      isFetching: false,
      isError: false,
    })

    const tree = render(
      <SellPopoverContent
        nft={mockProps.nft}
        onClose={mockProps.onClose}
        onSucess={onUpdate}
      />
    )

    expect(tree.container).toMatchSnapshot()
  })

  test('changing price calls setPrice', async () => {
    const setPrice = jest.fn()
    ;(useSellPopoverContent as jest.Mock).mockReturnValueOnce({
      isApproved: true,
      isLoading: false,
      price: 0,
      setPrice: setPrice,
      approve: jest.fn(),
      sell: jest.fn(),
      isFetching: false,
      isError: false,
    })

    const tree = render(
      <SellPopoverContent
        nft={mockProps.nft}
        onClose={mockProps.onClose}
        onSucess={onUpdate}
      />
    )

    const input = tree.getByTestId('price-input')

    fireEvent.change(input, { target: { value: '1' } })

    expect(setPrice).toBeCalledWith(1)
  })
})
