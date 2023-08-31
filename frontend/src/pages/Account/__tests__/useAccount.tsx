import React from 'react'
import { renderHook } from '@testing-library/react'
import useAccount from '../useAccount'
import { useMediaQuery } from '@chakra-ui/react'

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useMediaQuery: jest.fn(),
}))
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('useAccount', () => {
  test('should navigate', () => {
    ;(useMediaQuery as jest.Mock).mockImplementation(() => [true])

    const { result } = renderHook(() => useAccount())

    result.current.changeActivePage({
      icon: <div />,
      text: 'My NFTs',
      route: 'my-nfts',
      component: <div />,
    })

    expect(mockNavigate).toHaveBeenCalledWith('/account/dashboard/my-nfts')
  })
})
