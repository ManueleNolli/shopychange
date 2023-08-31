import { renderHook, act } from '@testing-library/react'
import useFetching from '../useFetching'

describe('useFetching', () => {
  test('should return initial state', () => {
    const { result } = renderHook(() => useFetching())
    expect(result.current.isFetching).toBe(true)
    expect(result.current.isError).toBe(false)
  })

  test('should update isFetching state', () => {
    const { result } = renderHook(() => useFetching())
    act(() => {
      result.current.setIsFetching(false)
    })
    expect(result.current.isFetching).toBe(false)
  })

  test('should update isError state', () => {
    const { result } = renderHook(() => useFetching())
    act(() => {
      result.current.setIsError(true)
    })
    expect(result.current.isError).toBe(true)
  })
})
