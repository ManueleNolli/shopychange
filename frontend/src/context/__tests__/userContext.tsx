import React from 'react'
import { render, act, renderHook } from '@testing-library/react'
import { UserProvider, useUserContext } from '../userContext'

describe('UserProvider', () => {
  test('should render children', () => {
    const { getByText } = render(
      <UserProvider>
        <div>Test</div>
      </UserProvider>
    )
    expect(getByText('Test')).toBeInTheDocument()
  })

  test('should update user context', () => {
    const { result } = renderHook(() => useUserContext(), {
      wrapper: UserProvider,
    })

    act(() => {
      result.current.updateUserContext('0x123', 1)
    })

    expect(result.current.userAddress).toBe('0x123')
    expect(result.current.blockchainNetworkId).toBe(1)
  })

  test('should clear user context', () => {
    const { result } = renderHook(() => useUserContext(), {
      wrapper: UserProvider,
    })
    act(() => {
      result.current.updateUserContext('address', 1)
      result.current.clearUserContext()
    })
    expect(result.current.userAddress).toBeNull()
    expect(result.current.blockchainNetworkId).toBeNull()
  })

  test('should throw error if used outside of UserProvider', () => {
    expect(() => renderHook(() => useUserContext())).toThrow(
      'useUserContext must be used within a UserProvider'
    )
  })
})
