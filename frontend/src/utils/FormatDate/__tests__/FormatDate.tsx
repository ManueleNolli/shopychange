import { formatDate } from '../FormatDate'

describe('FormatDate', () => {
  test('formatDate', () => {
    const dateTimestamp = 1689700035000
    const date = new Date(dateTimestamp)
    const expected = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    expect(formatDate(dateTimestamp)).toEqual(expected)
  })
})
