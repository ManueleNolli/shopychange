import { validateAddress } from '../ValidateAddress'

describe('validateAddress', () => {
  test('should return "Invalid address" for invalid address', () => {
    const invalidAddress = '0x123'
    const result = validateAddress(invalidAddress)
    expect(result).toBe('Invalid address')
  })

  test('should return undefined for valid address', () => {
    const validAddress = '0x1234567890123456789012345678901234567890'
    const result = validateAddress(validAddress)
    expect(result).toBeUndefined()
  })
})
