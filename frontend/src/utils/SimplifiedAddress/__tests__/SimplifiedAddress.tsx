import React from 'react'
import {
  simplifiedAddress,
  renderAddress,
  renderAddressWithTokenId,
} from '../SimplifiedAddress'
import { render } from '@testing-library/react'
import { Link } from 'react-router-dom'

jest.mock('react-router-dom', () => ({
  Link: jest.fn(),
}))

describe('SimplifiedAddress', () => {
  test('simplifiedAddress', () => {
    expect(
      simplifiedAddress('0x1234567890123456789012345678901234567890')
    ).toEqual('0x1234...7890')
  })

  test('renderAddress', () => {
    ;(Link as unknown as jest.Mock).mockImplementation(
      ({ children }) => children
    )

    const tree = render(
      renderAddress('0x1234567890123456789012345678901234567890', '/nft/1')
    )

    expect(tree.container).toMatchSnapshot()
  })

  test('renderAddressWithTokenId', () => {
    ;(Link as unknown as jest.Mock).mockImplementation(
      ({ children }) => children
    )
    const address = '0x1234567890123456789012345678901234567890'
    const tokenId = 123
    const navigate = '/path/to/navigate'

    const tree = render(renderAddressWithTokenId(address, tokenId, navigate))

    expect(tree.container).toMatchSnapshot()
  })
})
