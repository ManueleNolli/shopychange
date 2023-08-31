import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import CreateSingleToken from '../CreateSingleToken'
import useCreateSingleToken from '../useCreateSingleToken'
import { validateImage } from '../../../../utils/ValidateImage/validateImage'
import { Logo } from '../../../../assets/AssetsManager'
jest.mock('../useCreateSingleToken', () => jest.fn())

jest.mock('../../../../utils/ValidateImage/validateImage', () => ({
  validateImage: jest.fn(),
}))

const mockCreateObjectURL = jest.fn()
URL.createObjectURL = mockCreateObjectURL

describe('CreateSingleToken', () => {
  test('renders correctly', () => {
    ;(useCreateSingleToken as jest.Mock).mockReturnValue({
      isLoading: false,
      contracts: [
        {
          name: 'Shopychange Storage',
          symbol: 'SCS',
          address: 'mockedAddress',
        },
        {
          name: 'Contract',
          symbol: 'symbol',
          address: 'mockedAddress2',
        },
      ],
      handleSubmit: jest.fn(),
    })

    const tree = render(<CreateSingleToken />)
    expect(tree.container).toMatchSnapshot()
  })

  test('should validate image', async () => {
    ;(validateImage as jest.Mock).mockResolvedValueOnce(true)
    ;(useCreateSingleToken as jest.Mock).mockReturnValue({
      isLoading: false,
      contracts: [
        {
          name: 'Shopychange Storage',
          symbol: 'SCS',
          address: 'mockedAddress',
        },
        {
          name: 'Contract',
          symbol: 'symbol',
          address: 'mockedAddress2',
        },
      ],
      handleSubmit: jest.fn(),
    })

    render(<CreateSingleToken />)

    const imageInput = screen.getByTestId('image-input')

    // use logo as image with mocked size
    Object.defineProperty(imageInput, 'files', {
      value: [new File([Logo], 'filename', { type: 'image/png' })],
    })

    await act(async () => {
      fireEvent.change(imageInput)
    })

    //should have called validateImage
    expect(validateImage).toHaveBeenCalled()

    const deleteButton = screen.getByTestId('delete-button')

    await act(async () => {
      fireEvent.click(deleteButton)
    })

    //should have called validateImage
    expect(validateImage).toHaveBeenCalled()
  })

  test('should handle add and remove attributes', async () => {
    ;(useCreateSingleToken as jest.Mock).mockReturnValue({
      isLoading: false,
      contracts: [
        {
          name: 'Shopychange Storage',
          symbol: 'SCS',
          address: 'mockedAddress',
        },
        {
          name: 'Contract',
          symbol: 'symbol',
          address: 'mockedAddress2',
        },
      ],
      handleSubmit: jest.fn(),
    })

    render(<CreateSingleToken />)

    const addAttributeButton = screen.getByLabelText('add-attribute')

    await act(async () => {
      fireEvent.click(addAttributeButton)
    })

    const traitTypeCount = screen.getAllByPlaceholderText('trait type').length
    const traitValueCount = screen.getAllByPlaceholderText('value').length

    expect(traitTypeCount).toBe(2)
    expect(traitValueCount).toBe(2)

    const removeAttributeButton = screen.getAllByLabelText('remove-attribute')

    await act(async () => {
      fireEvent.click(removeAttributeButton[0])
    })

    const traitTypeCountAfterRemove =
      screen.getAllByPlaceholderText('trait type').length
    const traitValueCountAfterRemove =
      screen.getAllByPlaceholderText('value').length

    expect(traitTypeCountAfterRemove).toBe(1)
    expect(traitValueCountAfterRemove).toBe(1)
  })

  test('should handle add and remove royalties', async () => {
    ;(useCreateSingleToken as jest.Mock).mockReturnValue({
      isLoading: false,
      contracts: [
        {
          name: 'Shopychange Storage',
          symbol: 'SCS',
          address: 'mockedAddress',
        },
        {
          name: 'Contract',
          symbol: 'symbol',
          address: 'mockedAddress2',
        },
      ],
      handleSubmit: jest.fn(),
    })

    render(<CreateSingleToken />)

    const addAttributeButton = screen.getByLabelText('add-royalty')

    await act(async () => {
      fireEvent.click(addAttributeButton)
    })

    const placeholder = screen.getAllByPlaceholderText('Share (%)').length

    expect(placeholder).toBe(2)

    const removeRoyaltyButton = screen.getAllByLabelText('remove-royalty')

    await act(async () => {
      fireEvent.click(removeRoyaltyButton[0])
    })

    const placeholderAfterRemove =
      screen.getAllByPlaceholderText('Share (%)').length

    expect(placeholderAfterRemove).toBe(1)
  })
  test('should useDefaultRoyalties', async () => {
    ;(useCreateSingleToken as jest.Mock).mockReturnValue({
      isLoading: false,
      contracts: [
        {
          name: 'Shopychange Storage',
          symbol: 'SCS',
          address: 'mockedAddress',
        },
        {
          name: 'Contract',
          symbol: 'symbol',
          address: 'mockedAddress2',
        },
      ],
      handleSubmit: jest.fn(),
    })

    const { container } = render(<CreateSingleToken />)

    const checkbox = screen.getByText('Use default royalties')

    await act(async () => {
      fireEvent.click(checkbox)
    })
    await act(async () => {
      fireEvent.click(checkbox)
    })

    expect(container).toMatchSnapshot()
  })
})
