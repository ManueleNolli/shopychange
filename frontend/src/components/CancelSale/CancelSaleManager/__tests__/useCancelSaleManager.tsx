import { renderHook } from '@testing-library/react'
import useCancelSaleManager from '../useCancelSaleManager'

describe('useCancelSaleManager', () => {
  test('should return isOpen, onOpen, and onClose functions', () => {
    const { result } = renderHook(() => useCancelSaleManager())

    expect(result.current.isOpen).toBe(false)
    expect(typeof result.current.onOpen).toBe('function')
    expect(typeof result.current.onClose).toBe('function')
  })
})
