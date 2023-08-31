export const validatePresence = (fieldName: string, value: string) => {
  let error
  if (!value) {
    error = `${fieldName} is required`
  }
  return error
}
