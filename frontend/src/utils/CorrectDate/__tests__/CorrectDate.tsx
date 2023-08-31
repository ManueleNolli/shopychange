import { correctDate } from '../CorrectDate'

describe('CorrectDate', () => {
  test('CorrectDate 7 digit', () => {
    const dateTimestamp = '1689700035'
    const expected = 1689700035000
    expect(correctDate(dateTimestamp)).toEqual(expected)
  })
  test('CorrectDate 10 digit', () => {
    const dateTimestamp = '1689700035000'
    const expected = 1689700035000
    expect(correctDate(dateTimestamp)).toEqual(expected)
  })
})
