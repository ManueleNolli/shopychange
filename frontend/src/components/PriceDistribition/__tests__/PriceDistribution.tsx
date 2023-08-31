import React from 'react'
import { act, render } from '@testing-library/react'
import PriceDistrubution from '../PriceDistribution'
import usePriceDistrubution from '../usePriceDistribution'
import { renderAddress } from '../../../utils/SimplifiedAddress/SimplifiedAddress'

jest.mock('../usePriceDistribution', () => jest.fn())

jest.mock('../../../utils/SimplifiedAddress/SimplifiedAddress', () => ({
  renderAddress: jest.fn(),
}))

describe('PriceDistrubution', () => {
  test('render correctly owner', async () => {
    ;(usePriceDistrubution as jest.Mock).mockReturnValue({
      settedPrice: 2,
      remainingValue: 1,
      otherRoyalties: [
        {
          account: 'mockedAccount',
          share: 10,
        },
      ],
      otherRoyaltiesSum: 0,
      marketplaceRoyalty: 5,
      fixedNumber: jest.fn(),
      isFetching: false,
      isError: false,
    })
    ;(renderAddress as jest.Mock).mockReturnValue('mockedAddress')
    const tree = render(
      <PriceDistrubution
        price={1}
        isOwner={true}
        address={'mockedAddress'}
        tokenId={0}
      />
    )
    await act(async () => {
      Promise.resolve()
    })

    expect(tree.container).toMatchSnapshot()
  })
  test('render correctly not owner', async () => {
    ;(usePriceDistrubution as jest.Mock).mockReturnValue({
      settedPrice: 2,
      remainingValue: 1,
      otherRoyalties: [],
      otherRoyaltiesSum: 0,
      marketplaceRoyalty: 5,
      fixedNumber: jest.fn(),
      isFetching: false,
      isError: false,
    })
    ;(renderAddress as jest.Mock).mockReturnValue('mockedAddress')

    const tree = render(
      <PriceDistrubution
        price={1}
        isOwner={false}
        address={'mockedAddress'}
        tokenId={0}
      />
    )
    await act(async () => {
      Promise.resolve()
    })

    expect(tree.container).toMatchSnapshot()
  })
})
