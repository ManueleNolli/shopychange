import React from 'react'
import { render } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'
import { useColorMode } from '@chakra-ui/react'

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useColorMode: jest.fn(),
}))

describe('LoadingSpinner', () => {
  test('renders LoadingSpinner correctly Light Mode', () => {
    ;(useColorMode as jest.Mock).mockImplementation(() => ({
      colorMode: 'light',
    }))

    const tree = render(<LoadingSpinner />)

    expect(tree.container).toMatchSnapshot()
  })
  test('renders LoadingSpinner correctly Dark Mode', () => {
    ;(useColorMode as jest.Mock).mockImplementation(() => ({
      colorMode: 'dark',
    }))
    const tree = render(<LoadingSpinner />)

    expect(tree.container).toMatchSnapshot()
  })
})
