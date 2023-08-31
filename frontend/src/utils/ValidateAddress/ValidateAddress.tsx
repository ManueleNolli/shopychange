// validate blockchain address

export const validateAddress = (address: string) => {
  const regex = /^0x[a-fA-F0-9]{40}$/
  if (!regex.test(address)) {
    return 'Invalid address'
  }
}
