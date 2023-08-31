import CheckImageSrc from '../CheckImageSrc'

describe('CheckImageSrc', () => {
  test('works correctly with  existing image', () => {
    const src =
      'https://nft-cdn.alchemy.com/eth-mainnet/14d54b2db9aeac1355fb5b72b5621bb8'
    CheckImageSrc(src).then((res) => expect(res).toBeTruthy())
  })

  test('works correctly with non-existing image', () => {
    const src = 'https://test'
    CheckImageSrc(src).then((res) => expect(res).toBeFalsy())
  })

  test('should resolve to true when image loads successfully', async () => {
    // Create a mock image object
    const mockImage = new Image()
    jest.spyOn(global, 'Image').mockImplementation(() => mockImage)

    // Call the function and await the result
    const result = CheckImageSrc('https://example.com/image.jpg')

    // Resolve the onload promise
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockImage.onload()
    // Assert that the result is true
    expect(await result).toBe(true)

    // Restore the global Image class
    ;(global.Image as jest.Mock).mockRestore()
  })

  test('should resolve to false when image fails to load', async () => {
    const mockImage = new Image()
    jest.spyOn(global, 'Image').mockImplementation(() => mockImage)

    const result = CheckImageSrc('https://example.com/image.jpg')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockImage.onerror()

    expect(await result).toBe(false)
    ;(global.Image as jest.Mock).mockRestore()
  })
})
