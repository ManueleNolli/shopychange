import React from 'react'
import { render } from '@testing-library/react'
import AccountAddressPage from '../AccountAddressPage'
import useAccountAddressPage from '../useAccountAddressPage'

jest.mock('../../../components/NFTOrCollectionViewer/NFTOrCollectionViewer')
jest.mock('../useAccountAddressPage', () => jest.fn())
const mockProps = {
  address: '0x1203A6e8bD6A063AEa9D4B7F8A2BaE9405fE44Cd',
}
jest.mock('../../../utils/SimplifiedAddress/SimplifiedAddress', () => ({
  simplifiedAddress: jest.fn((address: string) => address),
}))

const mockedData = {
  ownedNfts: [
    {
      contractAddress: '0x0000000000',
      tokenId: '0',
      image: 'https://example.com/image.png',
      name: 'Test NFT',
    },
    {
      contractAddress: '0x0000000001',
      tokenId: '1',
      image: 'https://example.com/image.png',
      name: 'Test1 NFT',
    },
  ],
}

describe('AccountAddressPage', () => {
  test('renders successfully', () => {
    ;(useAccountAddressPage as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      nfts: mockedData.ownedNfts,
    })

    const tree = render(<AccountAddressPage {...mockProps} />)
    expect(tree.container).toMatchSnapshot()
  })
})
