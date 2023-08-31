import React from 'react'
import { render } from '@testing-library/react'
import ModifySalePopoverContent from '../ModifySalePopoverContent'
import useModifySalePopoverContent from '../useModifySalePopoverContent'

const mockProps = {
  nft: {
    contractAddress: '0x0000000000',
    tokenId: 0,
    image:
      'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q',
    name: 'Test NFT',
  },
  onClose: jest.fn(),
  actualPrice: 0.4,
}
jest.mock('../useModifySalePopoverContent', () => jest.fn())

jest.mock('../../../PriceDistribition/PriceDistribution')

const onUpdate = jest.fn()

describe('SellPopoverContent', () => {
  test('renders correctly diff > 0', () => {
    ;(useModifySalePopoverContent as jest.Mock).mockReturnValue({
      isLoading: false,
      newPrice: 10,
      diffPercentage: 50,
      onPriceChange: jest.fn(),
      modify: jest.fn(),
    })
    const { container } = render(
      <ModifySalePopoverContent
        nft={mockProps.nft}
        onClose={mockProps.onClose}
        actualPrice={mockProps.actualPrice}
        onSucess={onUpdate}
      />
    )

    expect(container).toMatchSnapshot()
  })

  test('renders correctly diff < 0', () => {
    ;(useModifySalePopoverContent as jest.Mock).mockReturnValue({
      isLoading: false,
      newPrice: 10,
      diffPercentage: -50,
      onPriceChange: jest.fn(),
      modify: jest.fn(),
    })
    const { container } = render(
      <ModifySalePopoverContent
        nft={mockProps.nft}
        onClose={mockProps.onClose}
        actualPrice={mockProps.actualPrice}
        onSucess={onUpdate}
      />
    )

    expect(container).toMatchSnapshot()
  })
})
