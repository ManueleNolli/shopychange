import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import useCreateCollection from '../useCreateCollection'
import CreateCollection from '../CreateCollection'
import { Logo } from '../../../../assets/AssetsManager'
import { validateImage } from '../../../../utils/ValidateImage/validateImage'

const mockCreateObjectURL = jest.fn()
URL.createObjectURL = mockCreateObjectURL

jest.mock('../../../../utils/ValidateImage/validateImage', () => ({
  validateImage: jest.fn(),
}))

jest.mock('../useCreateCollection', () => jest.fn())

describe('CreateCollection', () => {
  test('renders correctly', () => {
    ;(useCreateCollection as jest.Mock).mockReturnValue({
      isLoading: false,
      handleSubmit: jest.fn(),
    })

    const tree = render(<CreateCollection />)

    expect(tree.container).toMatchSnapshot()
  })

  test('should add new nft', async () => {
    ;(useCreateCollection as jest.Mock).mockReturnValue({
      isLoading: false,
      handleSubmit: jest.fn(),
    })
    render(<CreateCollection />)
    const description = screen.getByPlaceholderText('description')
    await act(async () => {
      fireEvent.change(description, { target: { value: 'test' } })
    })
    const addNFTButton = screen.getByLabelText('add-nft')

    await act(async () => {
      fireEvent.click(addNFTButton)
    })

    const description2 = screen.getAllByPlaceholderText('description')

    expect(description2).toHaveLength(2)

    const valueFirstNFTDescription = description2[0].getAttribute('value')
    expect(valueFirstNFTDescription).toBe('test')

    const valueSecondNFTDescription = description2[1].getAttribute('value')
    expect(valueSecondNFTDescription).toBe('')
  })

  test('should add new nft when empty', async () => {
    ;(useCreateCollection as jest.Mock).mockReturnValue({
      isLoading: false,
      handleSubmit: jest.fn(),
    })
    render(<CreateCollection />)
    const removeNFTButton = screen.getByLabelText('remove-nft')

    await act(async () => {
      fireEvent.click(removeNFTButton)
    })

    const description = screen.queryByPlaceholderText('description')
    expect(description).toBeNull()

    const addNFTButton = screen.getByLabelText('add-nft-when-empty')

    await act(async () => {
      fireEvent.click(addNFTButton)
    })

    const description2 = screen.getAllByPlaceholderText('description')
    expect(description2).toHaveLength(1)
  })

  test('should remove nft', async () => {
    ;(useCreateCollection as jest.Mock).mockReturnValue({
      isLoading: false,
      handleSubmit: jest.fn(),
    })
    render(<CreateCollection />)
    const description = screen.getByPlaceholderText('description')

    await act(async () => {
      fireEvent.change(description, { target: { value: 'test' } })
    })
    const removeNFTButton = screen.getByLabelText('remove-nft')

    await act(async () => {
      fireEvent.click(removeNFTButton)
    })

    const description2 = screen.queryByPlaceholderText('description')
    expect(description2).toBeNull()
  })

  test('should scroll to left to previous nft', async () => {
    ;(useCreateCollection as jest.Mock).mockReturnValue({
      isLoading: false,
      handleSubmit: jest.fn(),
    })
    render(<CreateCollection />)

    const addNFTButton = screen.getByLabelText('add-nft')

    await act(async () => {
      fireEvent.click(addNFTButton)
    })

    const scrollLeftButton = screen.getByLabelText('scroll-left')

    await act(async () => {
      fireEvent.click(scrollLeftButton)
    })
  })

  test('should handle add and remove royalties', async () => {
    ;(useCreateCollection as jest.Mock).mockReturnValue({
      isLoading: false,
      handleSubmit: jest.fn(),
    })

    render(<CreateCollection />)

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
  test('should handle add and remove attributes', async () => {
    ;(useCreateCollection as jest.Mock).mockReturnValue({
      isLoading: false,
      handleSubmit: jest.fn(),
    })

    render(<CreateCollection />)

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

  test('should validate image', async () => {
    ;(validateImage as jest.Mock).mockResolvedValueOnce(true)
    ;(useCreateCollection as jest.Mock).mockReturnValue({
      isLoading: false,
      handleSubmit: jest.fn(),
    })

    render(<CreateCollection />)

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
})
