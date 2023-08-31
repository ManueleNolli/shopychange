import React from 'react'
import { Center, Text } from '@chakra-ui/react'

import { IoIosWarning } from 'react-icons/io'

export default function Error() {
  return (
    <Center mt="5vh">
      <IoIosWarning size={'4em'} color={'red'} />
      <Text color={'red'} as="b">
        Error! Please try again
      </Text>
    </Center>
  )
}
