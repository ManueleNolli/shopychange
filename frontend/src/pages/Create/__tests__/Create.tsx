import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Create from '../Create'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('Create', () => {
  test('renders correctly', () => {
    const tree = render(<Create />, { wrapper: BrowserRouter })
    expect(tree.container).toMatchSnapshot()
  })

  test('should navigate to /create/nft when Create Single NFT button is clicked', () => {
    render(<Create />, { wrapper: BrowserRouter })
    const createSingleNFTButton = screen.getByText('Create Single NFT')
    expect(createSingleNFTButton).toBeInTheDocument()
    createSingleNFTButton.click()
    expect(mockNavigate).toHaveBeenCalledWith('/create/nft')
  })

  test('should navigate to /create/collection when Create Collection button is clicked', () => {
    render(<Create />, { wrapper: BrowserRouter })
    const createCollectionButton = screen.getByText('Create Collection')
    expect(createCollectionButton).toBeInTheDocument()
    createCollectionButton.click()
    expect(mockNavigate).toHaveBeenCalledWith('/create/collection')
  })
})
