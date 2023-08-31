import React from 'react'
import NFTCardGrid from '../NFTCardGrid'

import { render, fireEvent } from '@testing-library/react'
import useNFTCardGrid from '../useNFTCardGrid'
import useNFTCard from '../../NFTCard/useNFTCard'

const mockData = [
  {
    contractAddress: '0x0000000000',
    tokenId: 0,
    image:
      'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q/0.png',
    name: 'Test NFT',
  },
  {
    contractAddress: '0x0000000000',
    tokenId: 1,
    image:
      'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q/1.png',
    name: 'Test NFT 1',
  },
]

jest.mock('../useNFTCardGrid', () => jest.fn())
jest.mock('../../Sell/SellOrIsForSale/SellOrIsForSale')
jest.mock('../../NFTCard/useNFTCard', () => jest.fn())

describe('NFTCardGrid', () => {
  test('renders NFTCardGrid component', () => {
    ;(useNFTCardGrid as jest.Mock).mockReturnValue({
      onNavigation: jest.fn(),
    })
    ;(useNFTCard as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      image: null,
      sale: null,
      updateSale: jest.fn(),
    })

    const { container } = render(<NFTCardGrid nfts={mockData} />)

    expect(container).toMatchSnapshot()
  })

  test('onClick call onNavigation', () => {
    const mockOnNavigation = jest.fn()
    ;(useNFTCardGrid as jest.Mock).mockReturnValue({
      onNavigation: mockOnNavigation,
    })
    ;(useNFTCard as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      image: null,
      sale: null,
      updateSale: jest.fn(),
    })

    const { getByTestId } = render(<NFTCardGrid nfts={mockData} />)

    fireEvent.click(getByTestId('onclick-button-0x0000000000-0'))

    expect(mockOnNavigation).toHaveBeenCalled()
  })
})
