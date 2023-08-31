import React from 'react'
import { render, act, fireEvent, screen } from '@testing-library/react'
import CollectionRoyalties from '../CollectionRoyalties'
import useCollectionRoyalties from '../useCollectionRoyalties'

jest.mock('../useCollectionRoyalties', () => jest.fn())

jest.mock('../../../components/WithdrawRoyaltyButton/WithdrawRoyaltyButton')
jest.mock('../../../utils/SimplifiedAddress/SimplifiedAddress', () => ({
  renderAddress: jest.fn((address: string) => address),
}))
describe('CollectionRoyalties', () => {
  test('render successfully', () => {
    ;(useCollectionRoyalties as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      isUpdateLoading: false,
      isRemoveDefaultLoading: false,
      collection: {
        address: '0x00',
        name: 'name',
        symbol: 'symbol',
      },
      royalties: {
        royalties: [
          {
            recipient: '0x00',
            share: 10,
          },
        ],
        royaltySum: 10,
        supportsErc2981: true,
        supportsErc2981MultiReceiver: true,
        hasPaymentSplitter: true,
      },
      handleSubmit: jest.fn(),
      handleRemoveDefault: jest.fn(),
    })
    const { container } = render(<CollectionRoyalties address="0x00" />)
    expect(container).toMatchSnapshot()
  })

  test('validate address', async () => {
    ;(useCollectionRoyalties as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      isUpdateLoading: false,
      isRemoveDefaultLoading: false,
      collection: {
        address: '0x00',
        name: 'name',
        symbol: 'symbol',
      },
      royalties: {
        royalties: [
          {
            recipient: '0x00',
            share: 10,
          },
        ],
        royaltySum: 10,
        supportsErc2981: true,
        supportsErc2981MultiReceiver: true,
        hasPaymentSplitter: true,
      },
      handleSubmit: jest.fn(),
      handleRemoveDefault: jest.fn(),
    })
    const tree = render(<CollectionRoyalties address="0x00" />)

    const button = screen.getByLabelText('add-royalty')

    // act to add address
    await act(async () => {
      fireEvent.click(button)
    })

    const input = tree.getAllByPlaceholderText('Receiver')[1]

    await act(async () => {
      fireEvent.change(input, { target: { value: '0x00' } })
    })

    expect(input).toHaveValue('0x00')
  })

  test('change value number', async () => {
    ;(useCollectionRoyalties as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      isUpdateLoading: false,
      isRemoveDefaultLoading: false,
      collection: {
        address: '0x00',
        name: 'name',
        symbol: 'symbol',
      },
      royalties: {
        royalties: [
          {
            recipient: '0x00',
            share: 10,
          },
        ],
        royaltySum: 10,
        supportsErc2981: true,
        supportsErc2981MultiReceiver: true,
        hasPaymentSplitter: true,
      },
      handleSubmit: jest.fn(),
      handleRemoveDefault: jest.fn(),
    })
    const tree = render(<CollectionRoyalties address="0x00" />)

    const input = tree.getByPlaceholderText('Share (%)')
    await act(async () => {
      fireEvent.change(input, { target: { value: '15' } })
    })

    expect(input).toHaveValue('15')
  })

  test('add address', async () => {
    ;(useCollectionRoyalties as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      isUpdateLoading: false,
      isRemoveDefaultLoading: false,
      collection: {
        address: '0x00',
        name: 'name',
        symbol: 'symbol',
      },
      royalties: {
        royalties: [
          {
            recipient: '0x00',
            share: 10,
          },
        ],
        royaltySum: 10,
        supportsErc2981: true,
        supportsErc2981MultiReceiver: true,
        hasPaymentSplitter: true,
      },
      handleSubmit: jest.fn(),
      handleRemoveDefault: jest.fn(),
    })
    render(<CollectionRoyalties address="0x00" />)

    const addresses = screen.getAllByPlaceholderText('Receiver')

    expect(addresses.length).toBe(1)

    const button = screen.getByLabelText('add-royalty')

    // act to add address
    await act(async () => {
      fireEvent.click(button)
    })

    const addressesAfterAdd = screen.getAllByPlaceholderText('Receiver')

    expect(addressesAfterAdd.length).toBe(2)
  })
  test('remove address', async () => {
    ;(useCollectionRoyalties as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      isUpdateLoading: false,
      isRemoveDefaultLoading: false,
      collection: {
        address: '0x00',
        name: 'name',
        symbol: 'symbol',
      },
      royalties: {
        royalties: [
          {
            recipient: '0x00',
            share: 10,
          },
        ],
        royaltySum: 10,
        supportsErc2981: true,
        supportsErc2981MultiReceiver: true,
        hasPaymentSplitter: true,
      },
      handleSubmit: jest.fn(),
      handleRemoveDefault: jest.fn(),
    })
    render(<CollectionRoyalties address="0x00" />)

    const addresses = screen.getAllByPlaceholderText('Receiver')

    expect(addresses.length).toBe(1)

    const button = screen.getByLabelText('remove-royalty')

    // act to add address
    await act(async () => {
      fireEvent.click(button)
    })

    const addressesAfterAdd = screen.queryAllByPlaceholderText('Receiver')

    expect(addressesAfterAdd.length).toBe(0)
  })
})
