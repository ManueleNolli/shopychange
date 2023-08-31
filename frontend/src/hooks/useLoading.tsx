import { useState } from 'react'

export default function useLoading() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  return { isLoading, setIsLoading, isError, setIsError }
}
