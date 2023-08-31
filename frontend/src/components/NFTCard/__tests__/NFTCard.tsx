import React from 'react'
import { act, render } from '@testing-library/react'
import NFTCard from '../NFTCard'
import { NFT } from '../../../types/components/NFT'
import useNFTCard from '../useNFTCard'

const nftMock: NFT = {
  contractAddress: '0x0000000000',
  tokenId: 0,
  image:
    'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q',
  name: 'Test NFT',
}

jest.mock('../../Sell/SellOrIsForSale/SellOrIsForSale')
jest.mock('../useNFTCard', () => jest.fn())

describe('NFTCard', () => {
  test('renders correctly', async () => {
    ;(useNFTCard as jest.Mock).mockReturnValueOnce({
      isFetching: false,
      isError: false,
      image: nftMock.image,
      sale: null,
      updateSale: jest.fn(),
    })

    const { container } = render(<NFTCard nft={nftMock} />)
    await act(async () => {
      await Promise.resolve() // Wait for state update
    })
    expect(container).toMatchSnapshot()
  })
})
