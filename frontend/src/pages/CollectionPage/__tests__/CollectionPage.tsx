import React from 'react'
import { render } from '@testing-library/react'
import CollectionPage from '../CollectionPage'
import useCollectionPage from '../useCollectionPage'

jest.mock('../../../components/NFTCardGrid/NFTCardGrid')
jest.mock('../../../components/WithdrawRoyaltyButton/WithdrawRoyaltyButton')
jest.mock('../useCollectionPage', () => jest.fn())
jest.mock('../../../utils/CollectionOwnerCheck/CollectionOwnerCheck', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="CollectionOwnerCheck">{children}</div>
  ),
}))
const mockProps = {
  contractAddress: '0x1203A6e8bD6A063AEa9D4B7F8A2BaE9405fE44Cd',
}

const mockReturnValue = {
  collection: {
    contract: {
      name: 'mockedContractName',
      symbol: 'mockedContractSymbol',
      address: 'mockedContractAddress',
    },
    nfts: [
      {
        contractAddress: 'mockedContractAddress',
        tokenId: 0,
        image: 'mockedImage',
        name: 'mockedName',
      },
      {
        contractAddress: 'mockedContractAddress1',
        tokenId: 1,
        image: 'mockedImage1',
        name: 'mockedName1',
      },
    ],
  },
}

describe('CollectionPage', () => {
  test('renders successfully', () => {
    ;(useCollectionPage as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      collection: mockReturnValue.collection,
      onNavigate: jest.fn(),
    })

    const tree = render(<CollectionPage {...mockProps} />)
    expect(tree.container).toMatchSnapshot()
  })
})
