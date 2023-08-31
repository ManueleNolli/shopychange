import React from 'react'
import { render, act, fireEvent, screen } from '@testing-library/react'
import NFTRoyalties from '../NFTRoyalties'
import useNFTRoyalties from '../useNFTRoyalties'

jest.mock('../useNFTRoyalties', () => jest.fn())

jest.mock('../../../components/WithdrawRoyaltyButton/WithdrawRoyaltyButton')
jest.mock('../../../utils/SimplifiedAddress/SimplifiedAddress', () => ({
  renderAddressWithTokenId: jest.fn((address: string) => address),
}))
describe('NFTRoyalties', () => {
  test('render successfully', () => {
    ;(useNFTRoyalties as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      isUpdateLoading: false,
      isRemoveDefaultLoading: false,
      nft: {
        name: 'TokenName',
        image: 'TokenImage',
        contractAddress: 'TokenContractAddress',
        tokenId: 0,
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
    const { container } = render(<NFTRoyalties address="0x00" tokenId={0} />)
    expect(container).toMatchSnapshot()
  })

  test('validate address', async () => {
    ;(useNFTRoyalties as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      isUpdateLoading: false,
      isRemoveDefaultLoading: false,
      nft: {
        name: 'TokenName',
        image: 'TokenImage',
        contractAddress: 'TokenContractAddress',
        tokenId: 0,
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
    const tree = render(<NFTRoyalties address="0x00" tokenId={0} />)

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
    ;(useNFTRoyalties as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      isUpdateLoading: false,
      isRemoveDefaultLoading: false,
      nft: {
        name: 'TokenName',
        image: 'TokenImage',
        contractAddress: 'TokenContractAddress',
        tokenId: 0,
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
    const tree = render(<NFTRoyalties address="0x00" tokenId={0} />)

    const input = tree.getByPlaceholderText('Share (%)')
    await act(async () => {
      fireEvent.change(input, { target: { value: '15' } })
    })

    expect(input).toHaveValue('15')
  })

  test('add address', async () => {
    ;(useNFTRoyalties as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      isUpdateLoading: false,
      isRemoveDefaultLoading: false,
      nft: {
        name: 'TokenName',
        image: 'TokenImage',
        contractAddress: 'TokenContractAddress',
        tokenId: 0,
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
    render(<NFTRoyalties address="0x00" tokenId={0} />)

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
    ;(useNFTRoyalties as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      isUpdateLoading: false,
      isRemoveDefaultLoading: false,
      nft: {
        name: 'TokenName',
        image: 'TokenImage',
        contractAddress: 'TokenContractAddress',
        tokenId: 0,
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
    render(<NFTRoyalties address="0x00" tokenId={0} />)

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
