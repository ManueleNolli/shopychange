// export const validateImage = (file: File) => {
//   const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
//   let error
//   if (!file) {
//     error = 'Image file is required'
//   } else if (!validTypes.includes(file.type) || file.size === 0) {
//     error = 'Image file is required'
//   }
//   return error
// }

export const validateImage = (file: File) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
  let error
  if (!validTypes.includes(file.type) || file.size === 0) {
    error = 'Image file is required'
  }
  return error
}
