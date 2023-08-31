import React from 'react'
import { render } from '@testing-library/react'
import Home from '../Home'
import useHome from '../useHome'

jest.mock('../../../components/NFTOrCollectionViewer/NFTOrCollectionViewer')

jest.mock('../useHome', () => jest.fn())

describe('Home', () => {
  test('renders successfully when not connected', () => {
    ;(useHome as jest.Mock).mockReturnValue({
      sales: [],
      isFetching: false,
      isError: false,
      isConnected: false,
    })
    const tree = render(<Home />)
    expect(tree.container).toMatchSnapshot()
    expect(
      tree.getByText('Please connect your wallet to view the market')
    ).toBeInTheDocument()
  })
  test('renders successfully when connected', () => {
    ;(useHome as jest.Mock).mockReturnValue({
      sales: [],
      isFetching: false,
      isError: false,
      isConnected: true,
    })
    const tree = render(<Home />)
    expect(tree.container).toMatchSnapshot()
    expect(tree.getByTestId('NFTOrCollectionViewer')).toBeInTheDocument()
  })
})
