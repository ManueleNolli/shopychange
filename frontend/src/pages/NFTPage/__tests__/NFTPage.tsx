import React from 'react'
import { render } from '@testing-library/react'
import NFTPage from '../NFTPage'
import useNFTPage from '../useNFTPage'

jest.mock('../../../utils/SimplifiedAddress/SimplifiedAddress', () => ({
  renderAddress: jest.fn((address: string) => address),
}))

jest.mock('../../../utils/FormatDate/FormatDate', () => ({
  formatDate: jest.fn((data: string) => data),
}))

jest.mock('../../../utils/CorrectDate/CorrectDate', () => ({
  correctDate: jest.fn((data: string) => data),
}))

jest.mock('../../../components/NFTHistoryTable/NFTHistoryTable')
jest.mock('../../../components/NFTOperations/NFTOperations')

jest.mock('../useNFTPage', () => jest.fn())
const mockProps = {
  contractAddress: 'mockedContractAddress',
  tokenId: 3,
}
const mockedData = {
  nftComplete: {
    nft: {
      contractAddress: 'mockedContractAddress',
      tokenId: 0,
      image: 'mockedImage',
      name: 'mockedName',
    },
    description: 'mockedDescription',
    contract: {
      name: 'mockedContractName',
      symbol: 'mockedContractSymbol',
      address: 'mockedContractAddress',
    },
    attributes: [
      {
        traitType: 'mockedTraitType',
        value: 'mockedValue',
      },
    ],
  },
  sale: {
    nftData: {
      contractAddress: 'mockedContractAddress',
      tokenId: 0,
      image: 'mockedImage',
      name: 'mockedName',
    },
    seller: 'mockedSeller',
    price: 0,
    status: 0,
  },
  nftHistory: [],
}
describe('NFTPage', () => {
  test('renders successfully', async () => {
    ;(useNFTPage as jest.Mock).mockReturnValue({
      image: 'mockedImage',
      nftComplete: mockedData.nftComplete,
      isNftCompleteFetching: false,
      isNftCompleteError: false,
      sale: mockedData.sale,
      isSaleFetching: false,
      isSaleError: false,
      history: mockedData.nftHistory,
      isHistoryFetching: false,
      isHistoryError: false,
      updateAll: jest.fn(),
    })
    const tree = render(<NFTPage {...mockProps} />)

    expect(tree.container).toMatchSnapshot()
  })
})
