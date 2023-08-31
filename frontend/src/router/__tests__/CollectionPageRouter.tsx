import React from 'react'
import { render, screen } from '@testing-library/react'
import CollectionPageRouter from '../CollectionPageRouter'
import { MemoryRouter, useParams } from 'react-router-dom'

jest.mock('../../pages/Error/Error')

jest.mock('../../pages/CollectionPage/CollectionPage')

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

describe('CollectionPageRouter', () => {
  test('Wrong params', () => {
    ;(useParams as jest.Mock).mockReturnValue({})

    render(<CollectionPageRouter />)
    expect(screen.getByTestId('Error')).toBeInTheDocument()
  })

  test('Correct params', () => {
    ;(useParams as jest.Mock).mockReturnValue({
      contractAddress: '0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced',
    })

    render(
      <MemoryRouter
        initialEntries={['/0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced']}
      >
        <CollectionPageRouter />
      </MemoryRouter>
    )

    expect(screen.getByTestId('CollectionPage')).toBeInTheDocument()
  })
})
