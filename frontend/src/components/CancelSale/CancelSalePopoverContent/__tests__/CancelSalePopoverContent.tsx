import React from 'react'
import { render } from '@testing-library/react'
import CancelSalePopoverContent from '../CancelSalePopoverContent'
import useCancelSalePopoverContent from '../useCancelSalePopoverContent'

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

jest.mock('../useCancelSalePopoverContent', () => jest.fn())

const onUpdate = jest.fn()

describe('CancelPopoverContent', () => {
  test('renders correctly  on loading', () => {
    ;(useCancelSalePopoverContent as jest.Mock).mockReturnValueOnce({
      isLoading: true,
      buyToken: jest.fn(),
    })

    const tree = render(
      <CancelSalePopoverContent
        nft={mockProps.nft}
        onClose={mockProps.onClose}
        onSuccess={onUpdate}
      />
    )

    expect(tree.container).toMatchSnapshot()
  })

  test('renders correctly ', () => {
    ;(useCancelSalePopoverContent as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      buyToken: jest.fn(),
    })

    const tree = render(
      <CancelSalePopoverContent
        nft={mockProps.nft}
        onClose={mockProps.onClose}
        onSuccess={onUpdate}
      />
    )

    expect(tree.container).toMatchSnapshot()
  })
})
