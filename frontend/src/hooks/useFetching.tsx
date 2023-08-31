import { useState } from 'react'

export default function useFetching() {
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  return { isFetching, setIsFetching, isError, setIsError }
}
