import React from 'react'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import Error from '../../components/Error/Error'
import { Center } from '@chakra-ui/react'

type QueryContainerProps = {
  children: React.ReactNode
  isLoading: boolean
  isError: boolean
}

export default function QueryContainer({
  children,
  isLoading,
  isError,
}: QueryContainerProps) {
  if (isLoading) {
    return (
      <Center flex="1">
        <LoadingSpinner />
      </Center>
    )
  }

  if (isError) {
    return <Error />
  }

  return <>{children}</>
}
