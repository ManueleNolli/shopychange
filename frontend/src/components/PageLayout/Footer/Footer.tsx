import React from 'react'
import { Box, Image, Stack, Text, Divider } from '@chakra-ui/react'
import { Logo } from '../../../assets/AssetsManager'

export default function Footer() {
  return (
    <Box mt="10">
      <Divider />
      <Stack
        minW={'100%'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'center' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Image src={Logo} alt="Logo" w={{ base: '8vw', md: '4vw' }} />
        <Text>© 2023 SUPSI by Manuele Nolli. All rights reserved</Text>
      </Stack>
    </Box>
  )
}
