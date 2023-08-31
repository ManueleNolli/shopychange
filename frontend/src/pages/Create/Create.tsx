import React from 'react'

import { Box, Center, Flex, Heading } from '@chakra-ui/react'
import ShadowButton from '../../components/ShadowButton/ShadowButton'
import { colors } from '../../styles/Colors'
import { useNavigate } from 'react-router-dom'

export default function Create() {
  const navigate = useNavigate()

  const onNavigation = (path: string) => {
    navigate(`/create/${path}`)
  }

  return (
    <Box>
      <Center>
        <Heading>Create NFTs</Heading>
      </Center>
      <Center mt="5vh">
        <Flex direction="column" justifyContent={'center'}>
          <ShadowButton
            label={'Create Single NFT'}
            bgColor={`${colors.blueChakraColor}.400`}
            textColor={'white'}
            shadowColor={colors.blueShadowColor}
            hoverColor={`${colors.blueChakraColor}.500`}
            focusColor={`${colors.blueChakraColor}.500`}
            buttonProps={{
              width: { base: '60vw', md: '40vw', '2xl': '20vw' },
              height: '10vh',
            }}
            onClick={() => onNavigation('nft')}
          />
          <ShadowButton
            label={'Create Collection'}
            bgColor={`${colors.blueChakraColor}.400`}
            textColor={'white'}
            shadowColor={colors.blueShadowColor}
            hoverColor={`${colors.blueChakraColor}.500`}
            focusColor={`${colors.blueChakraColor}.500`}
            buttonProps={{
              mt: '5vh',
              width: { base: '60vw', md: '40vw', '2xl': '20vw' },
              height: '10vh',
            }}
            onClick={() => onNavigation('collection')}
          />
        </Flex>
      </Center>
    </Box>
  )
}
