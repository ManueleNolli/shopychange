import {
  errorMessageRoyaltyReceiver,
  checkIfRoyaltyValuesIsInvalid,
} from '../FormikRoyalty'

describe('FormikRoyalty', () => {
  test('errorMessageRoyaltyReceiver', () => {
    const form = {
      errors: {
        royalties: [
          {
            receiver: 'error message',
          },
        ],
      },
      touched: {
        royalties: [
          {
            receiver: true,
          },
        ],
      },
    }
    const index = 0
    expect(errorMessageRoyaltyReceiver(form, index)).toBe('error message')
  })

  test('checkIfRoyaltyReceiverIsInvalid, form exceed 100', () => {
    const form = {
      values: {
        royalties: [
          {
            share: '50',
          },
          {
            share: '51',
          },
        ],
      },
    }
    expect(checkIfRoyaltyValuesIsInvalid(form)).toBe(true)
  })
})
