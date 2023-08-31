import React from 'react'

import { AccountIconProps } from '../../types/props/AccountIconProps'
import { AccountNavItem } from '../../types/components/AccountNavItem'
import { Link as LinkRouter } from 'react-router-dom'

import { colors } from '../../styles/Colors'

import {
  Box,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Link,
  useColorModeValue,
  Flex,
  Center,
  Text,
} from '@chakra-ui/react'
import { FaUser } from 'react-icons/fa'
import useAccountPopover from './useAccountPopover'

export default function AccountPopover({ navItems }: AccountIconProps) {
  const { popoverContentBgColor } = useAccountPopover()

  return (
    <Box>
      <Popover placement={'bottom-start'}>
        <PopoverTrigger>
          <Button
            data-testid="account-button"
            aria-label="Account"
            _focus={{ boxShadow: 'none' }}
            w="fit-content"
          >
            <FaUser />
          </Button>
        </PopoverTrigger>
        {navItems ? (
          <PopoverContent
            border={0}
            boxShadow={'xl'}
            bg={popoverContentBgColor}
            p={4}
            rounded={'xl'}
            w={{ base: '40vw', md: '20vw' }}
            maxW={{ base: '200px', md: '200px' }}
          >
            <Stack>
              {navItems.map((item) => (
                <Item key={item.label} {...item} />
              ))}
            </Stack>
          </PopoverContent>
        ) : null}
      </Popover>
    </Box>
  )
}

const Item = ({ label, icon, href, action }: AccountNavItem) => {
  if (action) {
    return (
      <Box
        onClick={action}
        // change hover mouse cursor
        _hover={{
          cursor: 'pointer',
        }}
      >
        <ItemContent label={label} icon={icon} />
      </Box>
    )
  } else {
    return (
      <Link as={LinkRouter} to={href ?? '#'} style={{ textDecoration: 'none' }}>
        <ItemContent label={label} icon={icon} />
      </Link>
    )
  }
}

const ItemContent = ({ label, icon }: AccountNavItem) => {
  return (
    <Box
      p={4}
      role={'group'}
      rounded={'md'}
      _hover={{
        bg: useColorModeValue(`${colors.popover.bgChakraColor}.50`, 'gray.900'),
        color: `${colors.popover.bgChakraColor}.400`,
      }}
      transition={'color .3s ease, transform .3s ease'}
    >
      <Flex>
        <Center
          flex="4"
          _groupHover={{ transform: 'scale(1.33)' }}
          transition={'transform .3s ease'}
          data-testid={`icon-${label}`}
        >
          {icon}
        </Center>
        <Box flex="6">
          <Text fontSize={'sm'} fontWeight={500} data-testid={`label-${label}`}>
            {label}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
