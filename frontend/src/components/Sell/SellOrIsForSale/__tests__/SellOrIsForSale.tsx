import React from 'react'
import { render } from '@testing-library/react'
import SellOrIsForSale from '../SellOrIsForSale'

const onUpdate = jest.fn()
const mockNFT = {
  contractAddress: 'mockContractAddress',
  tokenId: 0,
  image: 'mockImage',
  name: 'mockName',
}

const mockSale = {
  nftData: {
    contractAddress: 'mockContractAddress',
    tokenId: 0,
    image: 'mockImage',
    name: 'mockName',
  },
  seller: 'mockSeller',
  price: 0,
  status: 0,
}

jest.mock('../../SellManager/SellManager')

describe('SellOrIsForSale', () => {
  test('renders correctly if not listed', () => {
    const tree = render(
      <SellOrIsForSale nft={mockNFT} sale={mockSale} onUpdate={onUpdate} />
    )
    expect(tree.container).toMatchSnapshot()
  })
  test('renders correctly if listed', () => {
    const mockSaleWithStatus = {
      ...mockSale,
      status: 3,
    }

    const tree = render(
      <SellOrIsForSale
        nft={mockNFT}
        sale={mockSaleWithStatus}
        onUpdate={onUpdate}
      />
    )
    expect(tree.container).toMatchSnapshot()
  })
})
