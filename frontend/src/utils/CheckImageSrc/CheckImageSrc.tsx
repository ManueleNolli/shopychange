export default function CheckImageSrc(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = src

    img.onload = () => {
      resolve(true)
    }

    img.onerror = () => {
      resolve(false)
    }
  })
}
