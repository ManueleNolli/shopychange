import React from 'react'
import { render } from '@testing-library/react'
import NFTHistoryTable from '../NFTHistoryTable'
import { EventType, NFTHistory } from '../../../types/components/Events'

jest.mock('../../../utils/SimplifiedAddress/SimplifiedAddress', () => ({
  renderAddress: jest.fn((address: string) => address),
}))

jest.mock('../../../utils/FormatDate/FormatDate', () => ({
  formatDate: jest.fn((data: string) => data),
}))

jest.mock('../../../utils/CorrectDate/CorrectDate', () => ({
  correctDate: jest.fn((data: string) => data),
}))

const mockProps: NFTHistory = [
  {
    __typename: EventType.Mint,
    date: '1688821020',
    toAddress: '0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced',
  },
  {
    __typename: EventType.Transfer,
    date: '1689775320',
    fromAddress: '0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced',
    toAddress: '0xe9eFbC61285d75198B3a58794E054C1F6aa44b25',
  },
  {
    __typename: EventType.Burn,
    date: '1689776028',
    fromAddress: '0xe9eFbC61285d75198B3a58794E054C1F6aa44b25',
  },
  {
    __typename: EventType.Approval,
    date: '1689775248',
    owner: '0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced',
    approved: '0x8121270572A0c7319f9854dC0f4e1e9D30d36E56',
  },
  {
    __typename: EventType.ApprovalForAll,
    date: '1689775668',
    owner: '0xe9eFbC61285d75198B3a58794E054C1F6aa44b25',
    isApproved: true,
    operator: '0x8121270572A0c7319f9854dC0f4e1e9D30d36E56',
  },
  {
    __typename: EventType.ApprovalForAll,
    date: '1689775812',
    owner: '0xe9eFbC61285d75198B3a58794E054C1F6aa44b25',
    isApproved: false,
    operator: '0x8121270572A0c7319f9854dC0f4e1e9D30d36E56',
  },
  {
    __typename: EventType.SaleCreated,
    date: '1689752112',
    seller: '0xe9eFbC61285d75198B3a58794E054C1F6aa44b25',
    price: 0.05,
  },
  {
    __typename: EventType.SaleBought,
    date: '1689752652',
    seller: '0xe9eFbC61285d75198B3a58794E054C1F6aa44b25',
    buyer: '0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced',
    price: 0.001,
  },
  {
    __typename: EventType.SaleCancelled,
    date: '1689752544',
    seller: '0xe9eFbC61285d75198B3a58794E054C1F6aa44b25',
  },
  {
    __typename: EventType.SalePriceModified,
    date: '1689752280',
    seller: '0xe9eFbC61285d75198B3a58794E054C1F6aa44b25',
    previousPrice: 0.05,
    price: 0.06,
  },
]

describe('NFTHistoryTable', () => {
  test('renders correctly', async () => {
    const { container } = render(<NFTHistoryTable nftHistory={mockProps} />)
    expect(container).toMatchSnapshot()
  })
})
