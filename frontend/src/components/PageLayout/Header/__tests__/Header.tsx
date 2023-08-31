import React from 'react'
import { render } from '@testing-library/react'
import Header from '../Header'
import { Link } from 'react-router-dom'
import useHeader from '../useHeader'

export const NAV_ITEMS = [
  {
    label: 'Marketplace',
    children: [
      {
        label: 'All NFTs',
        subLabel: 'Discover all NFTs for sale',
        href: '#',
      },
      {
        label: 'Auctions',
        subLabel: 'Try your luck on an auction',
        href: '#',
      },
    ],
  },
]

jest.mock('@web3modal/react', () => ({
  Web3Button: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  Link: jest.fn(),
}))

jest.mock('../AdminButton/AdminButton')
jest.mock('../useHeader', () => jest.fn())

describe('Header', () => {
  test('renders correctly on mobile', () => {
    ;(Link as unknown as jest.Mock).mockImplementation(
      ({ children }) => children
    )
    ;(useHeader as jest.Mock).mockReturnValue({
      isOpen: false,
      onToggle: jest.fn(),
      isMobile: true,
      isConnected: false,
      toggleColor: jest.fn(),
      logo: jest.fn(),
      colorMode: 'light',
    })

    const tree = render(<Header />)

    expect(tree.container).toMatchSnapshot()
  })

  test('renders correctly on desktop, light mode', () => {
    ;(Link as unknown as jest.Mock).mockImplementation(
      ({ children }) => children
    )
    ;(useHeader as jest.Mock).mockReturnValue({
      isOpen: false,
      onToggle: jest.fn(),
      isMobile: false,
      isConnected: false,
      toggleColor: jest.fn(),
      logo: jest.fn(),
      colorMode: 'light',
    })

    const tree = render(<Header />)

    expect(tree.container).toMatchSnapshot()
  })

  test('renders correctly correctly nav items on desktop', () => {
    ;(Link as unknown as jest.Mock).mockImplementation(
      ({ children }) => children
    )
    ;(useHeader as jest.Mock).mockReturnValue({
      isOpen: true,
      onToggle: jest.fn(),
      isMobile: false,
      isConnected: false,
      toggleColor: jest.fn(),
      logo: jest.fn(),
      colorMode: 'dark',
    })

    const tree = render(<Header navItems={NAV_ITEMS} />)

    expect(tree.container).toMatchSnapshot()
  })

  test('renders correctly correctly nav items on mobile', () => {
    ;(Link as unknown as jest.Mock).mockImplementation(
      ({ children }) => children
    )
    ;(useHeader as jest.Mock).mockReturnValue({
      isOpen: true,
      onToggle: jest.fn(),
      isMobile: true,
      isConnected: false,
      toggleColor: jest.fn(),
      logo: jest.fn(),
      colorMode: 'dark',
    })

    const tree = render(<Header navItems={NAV_ITEMS} />)

    expect(tree.container).toMatchSnapshot()
  })

  test('renders correctly correctly on mobile, connected', () => {
    ;(Link as unknown as jest.Mock).mockImplementation(
      ({ children }) => children
    )
    ;(useHeader as jest.Mock).mockReturnValue({
      isOpen: true,
      onToggle: jest.fn(),
      isMobile: true,
      isConnected: true,
      toggleColor: jest.fn(),
      logo: jest.fn(),
      colorMode: 'dark',
    })

    const tree = render(<Header />)

    expect(tree.container).toMatchSnapshot()
  })

  test('renders correctly correctly on desktop, connected', () => {
    ;(Link as unknown as jest.Mock).mockImplementation(
      ({ children }) => children
    )
    ;(useHeader as jest.Mock).mockReturnValue({
      isOpen: false,
      onToggle: jest.fn(),
      isMobile: false,
      isConnected: true,
      toggleColor: jest.fn(),
      logo: jest.fn(),
      colorMode: 'dark',
    })

    const tree = render(<Header />)

    expect(tree.container).toMatchSnapshot()
  })
})
