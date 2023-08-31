import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, useParams } from 'react-router-dom'
import AccountDashboardPageRouter from '../AccountDashboardPageRouter'

jest.mock('../../pages/Account/Account')
jest.mock('../../data/accountSidebarData', () => ({
  data: [
    {
      icon: '<TbPhoto size="24px" />',
      text: 'My NFTs',
      route: 'my-nfts',
      component: null,
    },
  ],
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

describe('AccountDashboardPageRouter', () => {
  test('Wrong params', () => {
    ;(useParams as jest.Mock).mockReturnValue({})

    render(
      <MemoryRouter initialEntries={['/account/']}>
        <AccountDashboardPageRouter />
      </MemoryRouter>
    )

    expect(screen.getByTestId('Account')).toBeInTheDocument()
  })

  test('Correct params', () => {
    ;(useParams as jest.Mock).mockReturnValue({
      page: 'firstPage',
    })

    render(
      <MemoryRouter initialEntries={['/account/']}>
        <AccountDashboardPageRouter />
      </MemoryRouter>
    )

    expect(screen.getByTestId('Account')).toBeInTheDocument()
  })
})
