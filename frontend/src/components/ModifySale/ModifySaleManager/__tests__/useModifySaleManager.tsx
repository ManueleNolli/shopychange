import { renderHook } from '@testing-library/react'
import useModifySaleManager from '../useModifySaleManager'

describe('useModifySaleManager', () => {
  test('should return isOpen, onOpen, and onClose functions', () => {
    const { result } = renderHook(() => useModifySaleManager())

    expect(result.current.isOpen).toBe(false)
    expect(typeof result.current.onOpen).toBe('function')
    expect(typeof result.current.onClose).toBe('function')
  })
})
