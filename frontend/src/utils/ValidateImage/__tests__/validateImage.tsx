import { validateImage } from '../validateImage'

// describe('validateImage', () => {
//   test('should return error if image is empty', () => {
//     const file = new File([], 'image.png', {
//       type: 'image/png',
//     })
//     const result = validateImage(file)
//     expect(result).toBe('Image file is required')
//   })

//   test('should return error if image is not a valid type', () => {
//     const file = new File(['foo'], 'foo.txt', {
//       type: 'text/plain',
//     })
//     const result = validateImage(file)
//     expect(result).toBe('Image file is required')
//   })
// })

describe('validateImage', () => {
  test('should return "Image file is required" for empty file', () => {
    const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' })
    const result = validateImage(emptyFile)
    expect(result).toBe('Image file is required')
  })

  test('should return "Image file is required" for invalid file type', () => {
    const invalidFile = new File(['data'], 'invalid.txt', {
      type: 'text/plain',
    })
    const result = validateImage(invalidFile)
    expect(result).toBe('Image file is required')
  })

  test('should return undefined for valid file', () => {
    const validFile = new File(['data'], 'valid.jpg', { type: 'image/jpeg' })
    const result = validateImage(validFile)
    expect(result).toBeUndefined()
  })
})
