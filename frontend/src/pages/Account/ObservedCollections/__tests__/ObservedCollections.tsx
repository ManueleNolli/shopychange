import React from 'react'
import { render, fireEvent, act, screen } from '@testing-library/react'
import ObservedCollections from '../ObservedCollections'
import useObservedCollections from '../useObservedCollections'
import { validateAddress } from '../../../../utils/ValidateAddress/ValidateAddress'

jest.mock('../useObservedCollections', () => jest.fn())

jest.mock('../../../../utils/ValidateAddress/ValidateAddress', () => ({
  validateAddress: jest.fn(),
}))

describe('ObservedCollections', () => {
  test('render correctly', () => {
    ;(useObservedCollections as jest.Mock).mockReturnValue({
      observedCollections: [],
      isObservedFetching: false,
      isObservedError: false,
      handleSubmit: jest.fn(),
    })

    const { container } = render(<ObservedCollections />)

    expect(container).toMatchSnapshot()
  })

  test('validate address', async () => {
    ;(useObservedCollections as jest.Mock).mockReturnValue({
      observedCollections: [],
      isObservedFetching: false,
      isObservedError: false,
      handleSubmit: jest.fn(),
    })
    ;(validateAddress as jest.Mock).mockReturnValue(true)

    const { container } = render(<ObservedCollections />)
    const input = container.querySelector(
      'input[name="observedCollections[0]"]'
    )

    // act to trigger validateAddress

    await act(async () => {
      fireEvent.change(input as Element, {
        target: { value: '0x123' },
      })
    })

    expect(validateAddress).toHaveBeenCalled()
  })

  test('should add addresses', async () => {
    ;(useObservedCollections as jest.Mock).mockReturnValue({
      observedCollections: [],
      isObservedFetching: false,
      isObservedError: false,
      handleSubmit: jest.fn(),
    })
    ;(validateAddress as jest.Mock).mockReturnValue(true)

    render(<ObservedCollections />)
    const addresses = screen.getAllByPlaceholderText('Collection Address')

    expect(addresses.length).toBe(1)

    const button = screen.getByLabelText('add-address')

    // act to add address
    await act(async () => {
      fireEvent.click(button)
    })

    const addressesAfterAdd =
      screen.getAllByPlaceholderText('Collection Address')

    expect(addressesAfterAdd.length).toBe(2)
  })

  test('should remove addresses', async () => {
    ;(useObservedCollections as jest.Mock).mockReturnValue({
      observedCollections: [],
      isObservedFetching: false,
      isObservedError: false,
      handleSubmit: jest.fn(),
    })
    ;(validateAddress as jest.Mock).mockReturnValue(true)

    render(<ObservedCollections />)
    const addresses = screen.getAllByPlaceholderText('Collection Address')

    expect(addresses.length).toBe(1)

    const button = screen.getByLabelText('remove-address')

    // act to remove address
    await act(async () => {
      fireEvent.click(button)
    })

    const addressesAfterAdd =
      screen.queryAllByPlaceholderText('Collection Address')

    expect(addressesAfterAdd.length).toBe(0)
  })
})
