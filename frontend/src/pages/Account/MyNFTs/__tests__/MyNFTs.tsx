import React from 'react'
import { render, screen } from '@testing-library/react'
import MyNFTs from '../MyNFTs'
import useMyNFTs from '../useMyNFTs'

jest.mock('../../../../components/NFTOrCollectionViewer/NFTOrCollectionViewer')

jest.mock('../useMyNFTs', () => jest.fn())

describe('MyNFTs', () => {
  test('renders successfully with mocked data', async () => {
    ;(useMyNFTs as jest.Mock).mockReturnValue({
      ownedNfts: [],
      isFetching: false,
      isError: false,
      onNavigateToObservedCollections: jest.fn(),
    })

    const { container } = render(<MyNFTs />)

    expect(screen.getByTestId('NFTOrCollectionViewer')).toBeInTheDocument()

    //snapshot
    expect(container).toMatchSnapshot()
  })
})
