import React from 'react'
import {
  Box,
  Center,
  Divider,
  Heading,
  Text,
  Tag,
  Flex,
  VStack,
  NumberInput,
  NumberInputField,
  Select,
  FormControl,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react'
import { colors } from '../../styles/Colors'
import ShadowButton from '../../components/ShadowButton/ShadowButton'
import LoadingButton from '../../components/LoadingButton/LoadingButton'
import { NFT } from '../../types/components/NFT'
import { simplifiedAddress } from '../../utils/SimplifiedAddress/SimplifiedAddress'
import { Field, Form, Formik } from 'formik'
import { validateAddress } from '../../utils/ValidateAddress/ValidateAddress'

import useAdmin from './useAdmin'

export default function Admin() {
  const {
    royaltyValue,
    marketplaceBalance,
    setNewRoyaltyValue,
    isNewRoyaltyValueLoading,
    updateRoyaltyValue,
    cleanStorage,
    isCleanStorageLoading,
    sales,
    isCancelSaleLoading,
    onCancelSale,
    withdraw,
    isWithdrawLoading,
    withdrawToAll,
    isWithdrawToLoading,
    withdrawToAmount,
    isWithdrawToAmountLoading,
    setSaleToCancel,
  } = useAdmin()

  return (
    <Box>
      <Center>
        <Heading>Admin Page</Heading>
      </Center>
      <Box px="2vw" py="2vh">
        <VStack spacing="2vh" align={'start'}>
          <Heading size="md">Royalty</Heading>
          <Flex alignItems={'center'}>
            <Text mr="2vh">Royalty Value</Text>
            {royaltyValue !== null ? (
              <Tag
                size={'lg'}
                variant="solid"
                colorScheme={`${colors.primaryChakraColor}`}
              >
                {royaltyValue} %
              </Tag>
            ) : null}
          </Flex>

          <Flex alignItems={'center'}>
            <Text mr="2vh">Marketplace balance</Text>
            {marketplaceBalance !== null ? (
              <Tag
                size={'lg'}
                variant="solid"
                colorScheme={`${colors.primaryChakraColor}`}
              >
                {marketplaceBalance} ETH
              </Tag>
            ) : null}
          </Flex>

          <Flex alignItems={'center'}>
            <Text mr="2vh">New Royalty value (%)</Text>
            <NumberInput
              mr="2vh"
              w="8em"
              defaultValue={0}
              min={0}
              step={0.01}
              max={100}
              onChange={(value) => setNewRoyaltyValue(parseFloat(value))}
            >
              <NumberInputField
                textAlign="center"
                data-testid="input-royalty"
              />
            </NumberInput>
            <LoadingButton
              isLoading={isNewRoyaltyValueLoading}
              loadingButtonProps={{
                w: '12em',
              }}
            >
              <ShadowButton
                label={'Change Royalty Value'}
                bgColor={`${colors.sellChakraColor}.400`}
                textColor={'white'}
                shadowColor={colors.sellShadowColor}
                hoverColor={`${colors.sellChakraColor}.500`}
                focusColor={`${colors.sellChakraColor}.500`}
                onClick={updateRoyaltyValue}
              />
            </LoadingButton>
          </Flex>

          <Flex alignItems={'center'}>
            <Text mr="2vh">Withdraw</Text>

            <LoadingButton
              isLoading={isWithdrawLoading}
              loadingButtonProps={{
                w: '8em',
              }}
            >
              <ShadowButton
                label={'Withdraw'}
                bgColor={`${colors.sellChakraColor}.400`}
                textColor={'white'}
                shadowColor={colors.sellShadowColor}
                hoverColor={`${colors.sellChakraColor}.500`}
                focusColor={`${colors.sellChakraColor}.500`}
                onClick={withdraw}
              />
            </LoadingButton>
          </Flex>

          <Flex alignItems={'center'}>
            <Text mr="2vh">Withdraw To</Text>

            <Formik
              initialValues={{ address: '' }}
              onSubmit={(values: { address: string }) => {
                withdrawToAll(values.address)
              }}
            >
              {/* eslint-disable-next-line */}
              {({ values }: any) => (
                <Form>
                  <Flex direction={{ base: 'column', md: 'row' }}>
                    <Box w={{ base: '60vw', md: '25vw' }} maxW={'30em'}>
                      <Field
                        name="address"
                        validate={(value: string) => validateAddress(value)}
                      >
                        {/* eslint-disable-next-line */}
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={
                              form.errors.address && form.touched.address
                            }
                          >
                            <Input {...field} id={'address'} placeholder="to" />
                            <FormErrorMessage>
                              {form.errors.address}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <LoadingButton
                      isLoading={isWithdrawToLoading}
                      loadingButtonProps={{
                        w: '12em',
                        ml: { base: '0', md: '2vw' },
                      }}
                    >
                      <ShadowButton
                        label={'Withdraw To'}
                        bgColor={`${colors.sellChakraColor}.400`}
                        textColor={'white'}
                        shadowColor={colors.sellShadowColor}
                        hoverColor={`${colors.sellChakraColor}.500`}
                        focusColor={`${colors.sellChakraColor}.500`}
                        type="submit"
                        buttonProps={{
                          w: '12em',
                          ml: { base: '0', md: '2vw' },
                        }}
                      />
                    </LoadingButton>
                  </Flex>
                </Form>
              )}
            </Formik>
          </Flex>

          <Flex alignItems={'center'}>
            <Text mr="2vh">Withdraw To Amount</Text>

            <Formik
              initialValues={{ address: '', amount: 0 }}
              onSubmit={(values: { address: string; amount: number }) => {
                withdrawToAmount(values.address, values.amount)
              }}
            >
              {/* eslint-disable-next-line */}
              {({ values }: any) => (
                <Form>
                  <Flex direction={{ base: 'column', md: 'row' }}>
                    <Box w={{ base: '60vw', md: '25vw' }} maxW={'30em'}>
                      <Field
                        name="address"
                        validate={(value: string) => validateAddress(value)}
                      >
                        {/* eslint-disable-next-line */}
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={
                              form.errors.address && form.touched.address
                            }
                          >
                            <Input {...field} id={'address'} placeholder="to" />
                            <FormErrorMessage>
                              {form.errors.address}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <Box
                      w={{ base: '20vw', md: '10vw' }}
                      maxW={'10em'}
                      ml={{ base: '0', md: '2vw' }}
                    >
                      <Field key={'amount'} name={'amount'}>
                        {/* eslint-disable-next-line */}
                        {({ field, form }: any) => (
                          <FormControl>
                            <NumberInput
                              min={0}
                              max={marketplaceBalance ? marketplaceBalance : 0}
                              precision={2}
                              step={0.01}
                            >
                              <NumberInputField
                                {...field}
                                id={'amount'}
                                placeholder="Amount"
                              />
                            </NumberInput>
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <LoadingButton
                      isLoading={isWithdrawToAmountLoading}
                      loadingButtonProps={{
                        w: '12em',
                        ml: { base: '0', md: '2vw' },
                      }}
                    >
                      <ShadowButton
                        label={'Withdraw To Amount'}
                        bgColor={`${colors.sellChakraColor}.400`}
                        textColor={'white'}
                        shadowColor={colors.sellShadowColor}
                        hoverColor={`${colors.sellChakraColor}.500`}
                        focusColor={`${colors.sellChakraColor}.500`}
                        type="submit"
                        buttonProps={{
                          w: '12em',
                          ml: { base: '0', md: '2vw' },
                        }}
                      />
                    </LoadingButton>
                  </Flex>
                </Form>
              )}
            </Formik>
          </Flex>

          <Divider />
        </VStack>

        <VStack spacing="2vh" align={'start'} mt="2vh">
          <Heading size="md">Maintenance</Heading>
          <Flex alignItems={'center'}>
            <Text mr="2vh">
              Clean Marketplace smartcontract storage (only token{' '}
              <Text as="b">not</Text> for sale)
            </Text>
            <LoadingButton
              isLoading={isCleanStorageLoading}
              loadingButtonProps={{
                w: '8em',
              }}
            >
              <ShadowButton
                label={'Clean Storage'}
                bgColor={`${colors.sellChakraColor}.400`}
                textColor={'white'}
                shadowColor={colors.sellShadowColor}
                hoverColor={`${colors.sellChakraColor}.500`}
                focusColor={`${colors.sellChakraColor}.500`}
                onClick={cleanStorage}
              />
            </LoadingButton>
          </Flex>

          <Flex alignItems={'center'}>
            <Text mr="2vh">Cancel sale</Text>

            <Select
              data-testid="select-sale"
              size="md"
              w={{ base: '50vw', md: '15vw' }}
              mr="2vh"
              onChange={(e) => {
                const selectedSale = sales.find(
                  (sale: NFT) => sale.contractAddress === e.target.value
                )
                if (selectedSale) {
                  setSaleToCancel(selectedSale)
                }
              }}
            >
              {sales.map((sale: NFT) => (
                <option
                  data-testid="option-sale"
                  key={`${sale.contractAddress}.${sale.tokenId}`}
                  value={sale.contractAddress}
                >
                  {simplifiedAddress(sale.contractAddress)} - {sale.tokenId}
                </option>
              ))}
            </Select>

            <LoadingButton
              isLoading={isCancelSaleLoading}
              loadingButtonProps={{
                w: '7em',
              }}
            >
              <ShadowButton
                label={'Cancel Sale'}
                bgColor={`${colors.sellChakraColor}.400`}
                textColor={'white'}
                shadowColor={colors.sellShadowColor}
                hoverColor={`${colors.sellChakraColor}.500`}
                focusColor={`${colors.sellChakraColor}.500`}
                onClick={onCancelSale}
              />
            </LoadingButton>
          </Flex>
          <Divider />
        </VStack>
      </Box>
    </Box>
  )
}
