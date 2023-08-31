import React from 'react'
import BeatLoader from 'react-spinners/BeatLoader'
import { Center, useColorMode } from '@chakra-ui/react'

export default function LoadingSpinner() {
  const { colorMode } = useColorMode()

  return (
    <Center mt="5vh">
      <BeatLoader size={8} color={colorMode === 'light' ? '#000' : '#fff'} />
    </Center>
  )
}
