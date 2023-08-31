import React from 'react'
import { render, screen } from '@testing-library/react'
import CollectionRoyaltiesRouter from '../CollectionRoyaltiesRouter'
import { MemoryRouter, useParams } from 'react-router-dom'

jest.mock('../../pages/Error/Error')
jest.mock('../../pages/CollectionRoyalties/CollectionRoyalties')

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

describe('CollectionRoyaltiesRouter', () => {
  test('Wrong params', () => {
    ;(useParams as jest.Mock).mockReturnValue({})

    render(<CollectionRoyaltiesRouter />)
    expect(screen.getByTestId('Error')).toBeInTheDocument()
  })

  test('Correct params', () => {
    ;(useParams as jest.Mock).mockReturnValue({
      contractAddress: '0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced',
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <CollectionRoyaltiesRouter />
      </MemoryRouter>
    )

    expect(screen.getByTestId('CollectionOwnerCheck')).toBeInTheDocument()
    expect(screen.getByTestId('CollectionRoyalties')).toBeInTheDocument()
  })
})
