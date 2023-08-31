import React from 'react'

export const simplifiedAddress = (address: string) => {
  return address.slice(0, 6) + '...' + address.slice(-4)
}

import { Link as LinkRouter } from 'react-router-dom'
import { Text, Link } from '@chakra-ui/react'

export const renderAddress = (address: string, navigate: string) => {
  return (
    <Link color="blue.500" as={LinkRouter} to={navigate}>
      <Text>{simplifiedAddress(address)}</Text>
    </Link>
  )
}

export const renderAddressWithTokenId = (
  address: string,
  tokenId: number,
  navigate: string
) => {
  return (
    <Link color="blue.500" as={LinkRouter} to={navigate}>
      <Text>
        {simplifiedAddress(address)}/{tokenId}
      </Text>
    </Link>
  )
}
