import React from 'react'
import { render } from '@testing-library/react'

import BuyPopoverContent from '../BuyPopoverContent'
import useBuyPopoverContent from '../useBuyPopoverContent'

const mockProps = {
  nft: {
    contractAddress: '0x0000000000',
    tokenId: 0,
    image:
      'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q',
    name: 'Test NFT',
  },
  onClose: jest.fn(),
  price: 0.4,
}

jest.mock('../useBuyPopoverContent', () => jest.fn())
jest.mock('../../../PriceDistribition/PriceDistribution')

const onUpdate = jest.fn()

describe('SellPopoverContent', () => {
  test('renders correctly on loading', () => {
    ;(useBuyPopoverContent as jest.Mock).mockReturnValueOnce({
      isLoading: true,
      buyToken: jest.fn(),
    })

    const tree = render(
      <BuyPopoverContent
        nft={mockProps.nft}
        onClose={mockProps.onClose}
        price={mockProps.price}
        onSuccess={onUpdate}
      />
    )

    expect(tree.container).toMatchSnapshot()
  })
  test('renders correctly', () => {
    ;(useBuyPopoverContent as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      buyToken: jest.fn(),
    })

    const tree = render(
      <BuyPopoverContent
        nft={mockProps.nft}
        onClose={mockProps.onClose}
        price={mockProps.price}
        onSuccess={onUpdate}
      />
    )

    expect(tree.container).toMatchSnapshot()
  })
})
