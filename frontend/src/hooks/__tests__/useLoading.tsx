import { renderHook, act } from '@testing-library/react'
import useLoading from '../useLoading'

describe('useLoading', () => {
  test('should return initial state', () => {
    const { result } = renderHook(() => useLoading())
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  test('should update isLoading state', () => {
    const { result } = renderHook(() => useLoading())
    act(() => {
      result.current.setIsLoading(true)
    })
    expect(result.current.isLoading).toBe(true)
  })

  test('should update isError state', () => {
    const { result } = renderHook(() => useLoading())
    act(() => {
      result.current.setIsError(true)
    })
    expect(result.current.isError).toBe(true)
  })
})
