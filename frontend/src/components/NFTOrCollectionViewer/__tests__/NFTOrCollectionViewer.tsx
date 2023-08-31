import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import NFTOrCollectionViewer from '../NFTOrCollectionViewer'

jest.mock('../../NFTCardGrid/NFTCardGrid')

jest.mock('../../CollectionGrid/CollectionGrid')

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
describe('NFTOrCollectionViewer', () => {
  test('renders NFTOrCollectionViewer with NFT option correctly', () => {
    const tree = render(<NFTOrCollectionViewer nfts={mockData} />)

    expect(tree.getByTestId('NFTCardGrid')).toBeInTheDocument()
    expect(tree.container).toMatchSnapshot()
  })

  test('renders NFTOrCollectionViewer with Collection option correctly', () => {
    const tree = render(<NFTOrCollectionViewer nfts={mockData} />)

    const button = tree.getByTestId('button-collections')
    fireEvent.click(button)

    expect(tree.getByTestId('CollectionGrid')).toBeInTheDocument()
    expect(tree.container).toMatchSnapshot()
  })

  test('return to NFT view', () => {
    const tree = render(<NFTOrCollectionViewer nfts={mockData} />)

    const buttonCollections = tree.getByTestId('button-collections')
    fireEvent.click(buttonCollections)

    const buttonNFTs = tree.getByTestId('button-nfts')
    fireEvent.click(buttonNFTs)

    expect(tree.getByTestId('NFTCardGrid')).toBeInTheDocument()
    expect(tree.container).toMatchSnapshot()
  })

  test('renders successfully with empty data', () => {
    const tree = render(<NFTOrCollectionViewer nfts={[]} />)

    expect(tree.getByText('No NFTs found')).toBeInTheDocument()
    expect(tree.container).toMatchSnapshot()
  })
})
