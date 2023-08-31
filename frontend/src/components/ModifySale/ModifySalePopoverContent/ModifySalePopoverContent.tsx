import React from 'react'

import {
  ButtonGroup,
  Center,
  Container,
  Flex,
  Heading,
  NumberInput,
  NumberInputField,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'

import LoadingButton from '../../LoadingButton/LoadingButton'
import ShadowButton from '../../ShadowButton/ShadowButton'

import { FaLongArrowAltRight } from 'react-icons/fa'

import { ModifySalePopoverContentProps } from '../../../types/props/ModifySalePopoverContentProps'

import { colors } from '../../../styles/Colors'
import PriceDistrubution from '../../PriceDistribition/PriceDistribution'
import useModifySalePopoverContent from './useModifySalePopoverContent'

export default function ModifySalePopoverContent({
  nft,
  onClose,
  onSucess,
  actualPrice,
}: ModifySalePopoverContentProps) {
  const { isLoading, newPrice, diffPercentage, onPriceChange, modify } =
    useModifySalePopoverContent({
      nft,
      onClose,
      onSucess,
      actualPrice,
    })

  return (
    <Flex direction="column" flex="1" p="1vh">
      <Spacer />

      <Container flex="1" centerContent>
        <Heading size="lg" textAlign={'center'}>
          Are you sure you want to modify <Text as="i">{nft.name}</Text>?
        </Heading>
      </Container>

      <>
        <Spacer />
        <Center>
          <TableContainer>
            <Table variant="unstyled">
              <Thead>
                <Tr>
                  <Th>
                    <Text textAlign={'center'}>Actual Price</Text>
                  </Th>
                  <Th></Th>
                  <Th>
                    <Text textAlign={'center'}>New Price</Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <Center dir="column">
                      <NumberInput isDisabled value={actualPrice}>
                        <NumberInputField textAlign="center" />
                      </NumberInput>
                      <Text pl="2" color={'gray.500'}>
                        eth
                      </Text>
                    </Center>
                  </Td>
                  <Td>
                    <Text
                      as="b"
                      color={diffPercentage >= 0 ? 'green' : 'red'}
                      textAlign={'center'}
                    >
                      {diffPercentage.toFixed(2)} %
                    </Text>
                    <Center>
                      <FaLongArrowAltRight
                        size={'2em'}
                        color={diffPercentage >= 0 ? 'green' : 'red'}
                      />
                    </Center>
                  </Td>
                  <Td>
                    <Center dir="column">
                      <NumberInput
                        defaultValue={actualPrice}
                        min={0}
                        step={0.01}
                        onChange={onPriceChange}
                      >
                        <NumberInputField
                          textAlign="center"
                          data-testid="price-input"
                        />
                      </NumberInput>
                      <Text pl="2" color={'gray.500'}>
                        eth
                      </Text>
                    </Center>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Center>
      </>
      <Spacer />

      <PriceDistrubution
        price={newPrice}
        isOwner={true}
        address={nft.contractAddress}
        tokenId={nft.tokenId}
      />

      <Spacer />

      <Center flex="1">
        <ButtonGroup spacing="10">
          <LoadingButton isLoading={isLoading} data-testid="loading-button">
            <ShadowButton
              label={'Modify price'}
              bgColor={`${colors.modifyChakraColor}.400`}
              textColor={'white'}
              shadowColor={colors.modifyShadowColor}
              hoverColor={`${colors.modifyChakraColor}.500`}
              focusColor={`${colors.modifyChakraColor}.500`}
              onClick={modify}
            />
          </LoadingButton>
          <ShadowButton
            label={'Cancel'}
            bgColor={`${colors.cancelChakraColor}.500`}
            textColor={'white'}
            shadowColor={colors.cancelShadowColor}
            hoverColor={`${colors.cancelChakraColor}.600`}
            focusColor={`${colors.cancelChakraColor}.600`}
            onClick={onClose}
          />
        </ButtonGroup>
      </Center>
      <Spacer />
    </Flex>
  )
}
