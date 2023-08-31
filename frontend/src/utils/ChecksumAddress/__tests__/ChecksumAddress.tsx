import { getAddress } from 'viem'
import { checksumAddress } from '../ChecksumAddress'

jest.mock('viem', () => ({
  getAddress: jest.fn((address: string) => address),
}))

describe('ChecksumAddress', () => {
  test('should return checksum address', () => {
    ;(getAddress as jest.Mock).mockReturnValueOnce(
      '0x6E11f15b909f6e22801DF6e7742a21cD578D946E'
    )

    const address = '0x6E11f15b909f6e22801DF6e7742a21cD578D946E'
    const lowerCaseAddress = address.toLowerCase()

    expect(checksumAddress(lowerCaseAddress)).toBe(address)
  })
})
