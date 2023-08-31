import React from 'react'
import { render } from '@testing-library/react'
import useWithdrawRoyaltyButton from '../useWithdrawRoyaltyButton'
import WithdrawRoyaltyButton from '../WithdrawRoyaltyButton'

jest.mock('../../../utils/RoyaltiesCheck/RoyaltiesCheck', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="RoyaltiesCheck"> {children} </div>
  ),
}))

jest.mock('../useWithdrawRoyaltyButton', () => jest.fn())

const mockProps = {
  collectionAddress: '0x123',
  tokenId: 0,
  buttonProps: {
    maxW: '20em',
    w: '20em',
  },
}

describe('WithdrawRoyaltyButton', () => {
  test('renders WithdrawRoyaltyButton component, without payment splitter', () => {
    ;(useWithdrawRoyaltyButton as jest.Mock).mockReturnValue({
      withdrawValue: 0,
      isLoading: false,
      hasPaymentSplitter: false,
      withdraw: jest.fn(),
    })

    const { container } = render(<WithdrawRoyaltyButton {...mockProps} />)
    expect(container).toMatchSnapshot()
  })

  test('renders WithdrawRoyaltyButton component, with payment splitter', () => {
    ;(useWithdrawRoyaltyButton as jest.Mock).mockReturnValue({
      withdrawValue: 0,
      isLoading: false,
      hasPaymentSplitter: true,
      withdraw: jest.fn(),
    })

    const { container } = render(<WithdrawRoyaltyButton {...mockProps} />)
    expect(container).toMatchSnapshot()
  })
})
