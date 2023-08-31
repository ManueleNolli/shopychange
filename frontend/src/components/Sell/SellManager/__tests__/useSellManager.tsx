import { renderHook } from '@testing-library/react'
import useSellManager from '../useSellManager'

describe('useSellManager', () => {
  test('should return isOpen, onOpen, and onClose functions', () => {
    const { result } = renderHook(() => useSellManager())

    expect(result.current.isOpen).toBe(false)
    expect(typeof result.current.onOpen).toBe('function')
    expect(typeof result.current.onClose).toBe('function')
  })
})
