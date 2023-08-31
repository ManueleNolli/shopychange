import React from 'react'
import { render, screen } from '@testing-library/react'
import NFTPageRouter from '../NFTPageRouter'
import { MemoryRouter, useParams } from 'react-router-dom'

jest.mock('../../pages/Error/Error')

jest.mock('../../pages/NFTPage/NFTPage')

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

jest.mock('@wagmi/core', () => ({
  disconnect: jest.fn(),
}))

jest.mock('../../utils/ChecksumAddress/ChecksumAddress', () => ({
  checksumAddress: jest.fn(),
}))

describe('NFTInfoRouter', () => {
  test('Wrong params', () => {
    ;(useParams as jest.Mock).mockReturnValue({})

    render(<NFTPageRouter />)
    expect(screen.getByTestId('Error')).toBeInTheDocument()
  })

  test('Correct params', () => {
    ;(useParams as jest.Mock).mockReturnValue({
      contractAddress: '0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced',
      tokenId: '4',
    })

    render(
      <MemoryRouter
        initialEntries={['/0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced/4']}
      >
        <NFTPageRouter />
      </MemoryRouter>
    )

    expect(screen.getByTestId('NFTPage')).toBeInTheDocument()
  })

  test('Wrong tokenId', () => {
    ;(useParams as jest.Mock).mockReturnValue({
      contractAddress: '0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced',
      tokenId: 'wrong',
    })

    render(
      <MemoryRouter
        initialEntries={['/0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced/wrong']}
      >
        <NFTPageRouter />
      </MemoryRouter>
    )

    expect(screen.getByTestId('Error')).toBeInTheDocument()
  })
})
