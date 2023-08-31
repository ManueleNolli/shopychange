// data enter is timestamp like "1689700035"
export const correctDate = (data: string) => {
  if (data.length === 10) {
    return parseInt(data) * 1000
  }
  return parseInt(data)
}
