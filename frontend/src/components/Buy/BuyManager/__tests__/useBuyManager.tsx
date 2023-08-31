import { renderHook } from '@testing-library/react'
import useBuyManager from '../useBuyManager'

describe('useBuyManager', () => {
  test('should return isOpen, onOpen, and onClose functions', () => {
    const { result } = renderHook(() => useBuyManager())

    expect(result.current.isOpen).toBe(false)
    expect(typeof result.current.onOpen).toBe('function')
    expect(typeof result.current.onClose).toBe('function')
  })
})
