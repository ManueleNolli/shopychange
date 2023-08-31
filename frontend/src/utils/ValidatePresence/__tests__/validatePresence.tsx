import { validatePresence } from '../validatePresence'

describe('validatePresence', () => {
  test('should return error if value is empty', () => {
    const fieldName = 'test'
    const value = ''
    const result = validatePresence(fieldName, value)
    expect(result).toBe(`${fieldName} is required`)
  })
})
