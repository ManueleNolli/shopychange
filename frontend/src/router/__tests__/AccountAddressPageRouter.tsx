import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, useParams } from 'react-router-dom'
import AccountAddressPageRouter from '../AccountAddressPageRouter'

jest.mock('../../pages/Error/Error')
jest.mock('../../pages/AccountAddressPage/AccountAddressPage')

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

describe('AccountAddressPageRouter', () => {
  test('Wrong params', () => {
    ;(useParams as jest.Mock).mockReturnValue({})

    render(<AccountAddressPageRouter />)
    expect(screen.getByTestId('Error')).toBeInTheDocument()
  })

  test('Correct params', () => {
    ;(useParams as jest.Mock).mockReturnValue({
      address: '0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced',
    })

    render(
      <MemoryRouter
        initialEntries={['/account/0xEd6BE7e9d2A23373e1d2c87f17AE0780b814bced']}
      >
        <AccountAddressPageRouter />
      </MemoryRouter>
    )

    expect(screen.getByTestId('AccountAddressPage')).toBeInTheDocument()
  })
})
