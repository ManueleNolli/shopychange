import React from 'react'
import CollectionGrid from '../CollectionGrid'

import { render, act } from '@testing-library/react'
import { useUserContext } from '../../../context/userContext'
import useCollectionGrid from '../useCollectionGrid'

jest.mock('../../../services/BackendService', () => ({
  handlerQuery: jest.fn(),
  contractQuery: jest.fn(),
}))

jest.mock('../../NFTCard/NFTCard')

jest.mock('../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

jest.mock('../useCollectionGrid', () => jest.fn())

const mockData = [
  {
    contractAddress: '0x0000000000',
    tokenId: 0,
    image:
      'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q/0.png',
    name: 'Test NFT',
  },
  {
    contractAddress: '0x0000000000',
    tokenId: 1,
    image:
      'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q/1.png',
    name: 'Test NFT 1',
  },
]

describe('CollectionGrid', () => {
  test('renders CollectionGrid component', async () => {
    ;(useUserContext as jest.Mock).mockReturnValueOnce({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(useCollectionGrid as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      collections: [
        {
          contract: {
            name: 'Test Collection',
            symbol: 'TEST',
            address: '0x0000000000',
          },
          nfts: mockData,
        },
      ],
    })

    const tree = render(<CollectionGrid nfts={mockData} />)
    await act(async () => {
      Promise.resolve()
    })

    expect(tree.container).toMatchSnapshot()
  })
})
