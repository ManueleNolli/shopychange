// data enter is timestamp int like 1689700035000

export const formatDate = (data: number) => {
  const date = new Date(data)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}
