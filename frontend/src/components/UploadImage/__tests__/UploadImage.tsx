import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import UploadImage from '../UploadImage'

const mockCreateObjectURL = jest.fn()
URL.createObjectURL = mockCreateObjectURL

describe('UploadImage', () => {
  test('renders correctly with currentImage', () => {
    const tree = render(
      <UploadImage
        onUpload={jest.fn()}
        cancelUpload={jest.fn()}
        currentImage={new File([''], 'filename', { type: 'image/png' })}
      />
    )
    expect(tree.container).toMatchSnapshot()
  })

  test('renders correctly without currentImage', () => {
    const tree = render(
      <UploadImage
        onUpload={jest.fn()}
        cancelUpload={jest.fn()}
        currentImage={undefined}
      />
    )
    expect(tree.container).toMatchSnapshot()
  })

  test('should call onUpload when input changes', () => {
    const onUpload = jest.fn()
    const tree = render(
      <UploadImage
        onUpload={onUpload}
        cancelUpload={jest.fn()}
        currentImage={undefined}
      />
    )
    const input = tree.getByTestId('image-input')
    const file = new File([''], 'filename', { type: 'image/png' })
    Object.defineProperty(input, 'files', {
      value: [file],
    })
    expect(onUpload).not.toHaveBeenCalled()

    fireEvent.change(input)

    expect(onUpload).toHaveBeenCalled()
  })

  test('should call cancelUpload when delete button is clicked', () => {
    const cancelUpload = jest.fn()
    const tree = render(
      <UploadImage
        onUpload={jest.fn()}
        cancelUpload={cancelUpload}
        currentImage={new File([''], 'filename', { type: 'image/png' })}
      />
    )

    const deleteButton = tree.getByTestId('delete-button')
    expect(cancelUpload).not.toHaveBeenCalled()

    fireEvent.click(deleteButton)

    expect(cancelUpload).toHaveBeenCalled()
  })

  test('should call input ref when image is clicked', () => {
    const tree = render(
      <UploadImage
        onUpload={jest.fn()}
        cancelUpload={jest.fn()}
        currentImage={undefined}
      />
    )

    const image = tree.getByTestId('image-placeholder')
    const input = tree.getByTestId('image-input')

    input.click = jest.fn()

    fireEvent.click(image)

    expect(input.click).toHaveBeenCalled()
  })
})
