import React, { useEffect } from 'react'

import {
  Box,
  Text,
  Flex,
  Divider,
  Center,
  useColorModeValue,
  useDisclosure,
  Button,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

type SidebarProps = {
  data: SidebarDataWithActive[]
  children: React.ReactNode
  direction?: 'row' | 'column'
  onClick: (element: SidebarData) => void
}
import { SidebarData } from '../../../data/accountSidebarData'

import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'

import { colors } from '../../../styles/Colors'
import { SidebarDataWithActive } from '../Account'

export default function Sidebar({
  data,
  children,
  direction = 'row',
  onClick,
}: SidebarProps) {
  const { getButtonProps, getDisclosureProps, isOpen, onToggle } =
    useDisclosure()

  useEffect(() => {
    if (!isOpen) onToggle()
  }, [])

  return (
    <Flex direction={direction}>
      {direction === 'row' ? (
        <motion.div
          {...getDisclosureProps()}
          initial={false}
          hidden={false}
          animate={{ width: isOpen ? 400 : 100 }}
          style={{
            whiteSpace: 'nowrap',
            height: '100%',
          }}
        >
          <Box
            m="2"
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={'xl'}
            rounded={'lg'}
          >
            <Flex
              justifyContent={isOpen ? 'flex-end' : 'center'}
              alignItems={'center'}
              pt="4"
            >
              <Button
                {...getButtonProps()}
                variant={'unstyled'}
                data-testid="toggle-sidebar"
              >
                <Center>
                  {isOpen ? (
                    <FaAngleLeft size="24px" />
                  ) : (
                    <FaAngleRight size="24px" />
                  )}
                </Center>
              </Button>
            </Flex>

            <VStack
              pb={isOpen ? '10' : '5'}
              mx={isOpen ? '5' : '2'}
              alignItems={isOpen ? 'start' : 'center'}
              spacing="12px"
              divider={isOpen ? <Divider /> : <></>}
            >
              {data.map((item) => {
                return (
                  <RenderElementRow
                    isActive={item.active}
                    data={data}
                    key={item.text}
                    {...item}
                    onClick={onClick}
                    textVisible={isOpen}
                  />
                )
              })}
            </VStack>
          </Box>
        </motion.div>
      ) : (
        <Center my="5">
          <HStack spacing="12px" divider={<Divider />}>
            {data.map((item) => {
              return (
                <Center
                  data-testid="item-row-onclick"
                  onClick={() => onClick(item)}
                  p="4"
                  rounded={'md'}
                  role="group"
                  bg={item.active ? '#EBF8FFAA' : 'transparent'}
                  _hover={{
                    cursor: 'pointer',
                    bg: useColorModeValue(
                      `${colors.popover.bgChakraColor}.50`,
                      'gray.900'
                    ),
                    color: `${colors.popover.bgChakraColor}.400`,
                  }}
                  transition={'color .3s ease, transform .3s ease'}
                  key={item.text}
                >
                  <Center
                    _groupHover={{ transform: 'scale(1.33)' }}
                    transition={'transform .3s ease'}
                  >
                    {item.icon}
                  </Center>
                </Center>
              )
            })}
          </HStack>
        </Center>
      )}

      <Box w="100%">{children}</Box>
    </Flex>
  )
}

type SidebarElementRowProps = {
  isActive: boolean
  data: SidebarData[]
  icon: React.ReactNode
  text: string
  textVisible: boolean
  onClick: (element: SidebarData) => void
}
function RenderElementRow({
  isActive,
  data,
  icon,
  text,
  textVisible,
  onClick,
}: SidebarElementRowProps) {
  return (
    <Flex
      ml={textVisible ? '10%' : '0'}
      py="5"
      px="2"
      rounded={'md'}
      onClick={() => {
        data.forEach((item: SidebarData) => {
          if (item.text === text) onClick(item)
        })
      }}
      role={'group'}
      minW={textVisible ? '80%' : '0'}
      bg={isActive ? '#EBF8FFAA' : 'transparent'}
      _hover={{
        cursor: 'pointer',
        bg: useColorModeValue(`${colors.popover.bgChakraColor}.50`, 'gray.900'),
        color: `${colors.popover.bgChakraColor}.400`,
      }}
      transition={'color .3s ease, transform .3s ease'}
    >
      <Center
        flex={textVisible ? '0' : '1'}
        _groupHover={{ transform: 'scale(1.33)' }}
        transition={'transform .3s ease'}
      >
        {icon}
      </Center>
      <Text ml="12px" hidden={!textVisible}>
        {text}
      </Text>
    </Flex>
  )
}
