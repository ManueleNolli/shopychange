import React from 'react'
import { render, screen } from '@testing-library/react'
import NFTRoyaltiesRouter from '../NFTRoyaltiesRouter'
import { MemoryRouter, useParams } from 'react-router-dom'

jest.mock('../../pages/Error/Error')
jest.mock('../../pages/NFTRoyalties/NFTRoyalties')

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))
jest.mock('../../utils/CollectionOwnerCheck/CollectionOwnerCheck', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="CollectionOwnerCheck">{children}</div>
  ),
}))

jest.mock('@wagmi/core', () => ({
  disconnect: jest.fn(),
}))

jest.mock('../../utils/ChecksumAddress/ChecksumAddress', () => ({
  checksumAddress: jest.fn(),
}))

describe('NFTRoyaltiesRouter', () => {
  test('Wrong params', () => {
    ;(useParams as jest.Mock).mockReturnValue({})

    render(<NFTRoyaltiesRouter />)
    expect(screen.getByTestId('Error')).toBeInTheDocument()
  })

  test('Wrong token id params', () => {
    ;(useParams as jest.Mock).mockReturnValue({
      contractAddress: '0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced',
      tokenId: 'notanumber',
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <NFTRoyaltiesRouter />
      </MemoryRouter>
    )

    expect(screen.getByTestId('Error')).toBeInTheDocument()
  })

  test('Correct params', () => {
    ;(useParams as jest.Mock).mockReturnValue({
      contractAddress: '0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced',
      tokenId: '1',
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <NFTRoyaltiesRouter />
      </MemoryRouter>
    )

    expect(screen.getByTestId('CollectionOwnerCheck')).toBeInTheDocument()
    expect(screen.getByTestId('NFTRoyalties')).toBeInTheDocument()
  })
})
