import React from 'react'

import { HeaderProps } from '../../../types/props/HeaderProps'
import { NavItem } from '../../../types/components/NavItem'

type NavItemsProps = {
  navItems: NavItem[]
}
import { Link as LinkRouter } from 'react-router-dom'

import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  Image,
  useDisclosure,
  Spacer,
  Center,
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons'

import { BsFillSunFill, BsMoonStarsFill } from 'react-icons/bs'

import { Web3Button } from '@web3modal/react'

import AccountPopover from '../../AccountPopover/AccountPopover'

import { colors } from '../../../styles/Colors'
import AdminButton from './AdminButton/AdminButton'
import useHeader from './useHeader'

export default function Header({ navItems, accountItems }: HeaderProps) {
  const {
    isOpen,
    onToggle,
    isMobile,
    isConnected,
    toggleColor,
    logo,
    colorMode,
  } = useHeader()

  return (
    <Box>
      <Box>
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH={'5vh'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          align={'center'}
        >
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
          <Flex
            justify="flex-start"
            w={{ base: '20vw', md: '20vw' }}
            h={{ base: '5vh', md: '10vh' }}
          >
            {isMobile ? (
              <LinkRouter to="/">
                <Center display={{ base: 'flex', md: 'none' }}>
                  <Image
                    src={logo()}
                    alt="Logo"
                    objectFit="contain"
                    w="20vw"
                    h="5vh"
                  />
                </Center>
              </LinkRouter>
            ) : (
              <LinkRouter to="/">
                <Image
                  src={logo()}
                  alt="Logo"
                  w="100%"
                  h="100%"
                  objectFit="contain"
                />
              </LinkRouter>
            )}
          </Flex>

          <Spacer display={{ base: 'none', md: 'flex' }} />

          <Flex
            display={{ base: 'none', md: 'flex' }}
            w={{ base: '100%', md: '40vw' }}
          >
            {navItems ? <DesktopNav navItems={navItems} /> : null}
          </Flex>

          <Spacer display={{ base: 'none', md: 'flex' }} />

          <Flex
            flex={{ base: 1, md: 'none' }}
            justify="end"
            w={{ base: '100%', md: '20vw' }}
          >
            <Stack direction={'row'} spacing={6}>
              <Box display={{ base: 'none', md: 'flex' }}>
                <Web3Button data-testid="connect-wallet-button" />
              </Box>

              {isConnected ? <AdminButton /> : null}
              {isConnected ? <AccountPopover navItems={accountItems} /> : null}

              <Button
                aria-label="Toggle Color Mode"
                data-testid="toggle-color-mode"
                onClick={toggleColor}
                _focus={{ boxShadow: 'none' }}
                w="fit-content"
              >
                {colorMode === 'light' ? (
                  <BsMoonStarsFill data-testid="moonIcon" />
                ) : (
                  <BsFillSunFill data-testid="sunIcon" />
                )}
              </Button>
            </Stack>
          </Flex>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          {navItems ? <MobileNav navItems={navItems} /> : null}
        </Collapse>
      </Box>
    </Box>
  )
}

const DesktopNav = ({ navItems }: NavItemsProps) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('gray.800', 'white')
  const popoverContentBgColor = useColorModeValue('white', 'gray.800')

  return (
    <Center flex={1}>
      <Stack direction={'row'} spacing={4}>
        {navItems.map((navItem: NavItem) => (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Link
                  p={2}
                  href={navItem.href ?? '#'}
                  fontSize={'md'}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor,
                  }}
                  data-testid={`label-${navItem.label}`}
                >
                  {navItem.label}
                </Link>
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={'xl'}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}
                >
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        ))}
      </Stack>
    </Center>
  )
}

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{
        bg: useColorModeValue(`${colors.popover.bgChakraColor}.50`, 'gray.900'),
      }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: `${colors.popover.textChakraColor}.400` }}
            fontWeight={500}
            data-testid={`childrenLabel-${label}`}
          >
            {label}
          </Text>
          <Text fontSize={'sm'} data-testid={`childrenSubLabel-${subLabel}`}>
            {subLabel}
          </Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon
            color={`${colors.popover.bgChakraColor}.400`}
            w={5}
            h={5}
            as={ChevronRightIcon}
          />
        </Flex>
      </Stack>
    </Link>
  )
}

const MobileNav = ({ navItems }: NavItemsProps) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      <Center display={{ base: 'flex', md: 'none' }}>
        <Web3Button />
      </Center>
      {navItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
          data-testid={`labelMobile-${label}`}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link
                key={child.label}
                py={2}
                href={child.href}
                data-testid={`childrenLabelMobile-${child.label}`}
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}
