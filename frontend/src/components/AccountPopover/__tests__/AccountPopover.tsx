import React from 'react'
import { render, screen } from '@testing-library/react'
import AccountPopover from '../AccountPopover'
import { BrowserRouter } from 'react-router-dom'

import { FaUser } from 'react-icons/fa'

const actionMock = jest.fn()

const navItems = [
  {
    label: 'Profile',
    icon: <FaUser />,
    href: '/account',
  },
  {
    label: 'Watchlist',
    icon: <FaUser />,
    href: '/account/watchlist',
  },
  {
    label: 'Create',
    icon: <FaUser />,
    href: '/account/create',
  },
  {
    label: 'Language',
    icon: <FaUser />,
    href: '/account/personalize',
  },
  {
    label: 'Disconnect',
    icon: <FaUser />,
    action: actionMock,
  },
]

describe('AccountPopover', () => {
  test('renders correctly', () => {
    const tree = render(<AccountPopover navItems={navItems} />, {
      wrapper: BrowserRouter,
    })
    expect(tree.container).toMatchSnapshot()

    expect(screen.getByTestId('label-Profile')).toBeInTheDocument()
    expect(screen.getByTestId('label-Watchlist')).toBeInTheDocument()
    expect(screen.getByTestId('label-Create')).toBeInTheDocument()
    expect(screen.getByTestId('label-Language')).toBeInTheDocument()
    expect(screen.getByTestId('label-Disconnect')).toBeInTheDocument()

    // test action button
    const disconnectButton = screen.getByTestId('label-Disconnect')
    expect(disconnectButton).toBeInTheDocument()
    disconnectButton.click()
    expect(actionMock).toHaveBeenCalled()
  })
})
