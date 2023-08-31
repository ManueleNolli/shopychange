{
  /* eslint-disable */
}

import React, { useRef, useState } from 'react'

import {
  Box,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  HStack,
  Spacer,
  Text,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'
import { colors } from '../../../styles/Colors'

import { MdDelete } from 'react-icons/md'
import { TiPlus } from 'react-icons/ti'
import { BsFillCaretRightFill, BsFillCaretLeftFill } from 'react-icons/bs'

import UploadImage from '../../../components/UploadImage/UploadImage'
import LoadingButton from '../../../components/LoadingButton/LoadingButton'
import ShadowButton from '../../../components/ShadowButton/ShadowButton'
import { Formik, Form, Field, FieldArray } from 'formik'

import { Attribute, NewNFT } from '../../../types/components/NewNFT'

import { validatePresence } from '../../../utils/ValidatePresence/validatePresence'
import { validateImage } from '../../../utils/ValidateImage/validateImage'
import { Royalty } from '../../../types/components/Royalty'
import { validateAddress } from '../../../utils/ValidateAddress/ValidateAddress'
import {
  checkIfRoyaltyReceiverIsInvalid,
  errorMessageRoyaltyReceiver,
  checkIfRoyaltyValuesIsInvalid,
  checkIfLastRoyalty,
} from '../../../utils/FormikRoyalty/FormikRoyalty'
import useCreateCollection from './useCreateCollection'

export interface FormValues {
  name: string
  symbol: string
  nfts: NewNFT[]
  royalties: Royalty[]
}

export default function CreateCollection() {
  const { isLoading, handleSubmit } = useCreateCollection()

  const [currentNftIndex, setCurrentNftIndex] = useState<number>(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const addNFTref = useRef<HTMLButtonElement>(null)

  const scrollLeft = () => {
    if (containerRef.current && currentNftIndex > 0) {
      setCurrentNftIndex(currentNftIndex - 1)
      containerRef.current.scrollLeft -= window.innerWidth * 0.5 // Adjust the scroll distance as needed
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      setCurrentNftIndex(currentNftIndex + 1)
      containerRef.current.scrollLeft += window.innerWidth * 0.5 // Adjust the scroll distance as needed
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddNFT = (push: any, scrollRight: any) => {
    push({
      name: '',
      description: '',
      image: new File([], ''),
      attributes: [
        {
          trait_type: '',
          value: '',
        },
      ],
    })
    // HACK: Wait for the new NFT to be added to the DOM before scrolling
    setTimeout(() => {
      scrollRight()
    }, 0)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRemoveNFT = (remove: any, index: number) => {
    setCurrentNftIndex(currentNftIndex - 1)
    remove(index)
  }

  return (
    <Box mb="4vh">
      <Center>
        <Heading>New Collection</Heading>
      </Center>

      <Center mt="2vh">
        <Box w={{ base: '90vw', md: '50vw' }}>
          <Formik
            initialValues={{
              name: '',
              symbol: '',
              royalties: [
                {
                  receiver: '',
                  share: NaN,
                },
              ],
              nfts: [
                {
                  name: '',
                  description: '',
                  image: new File([], ''),
                  attributes: [
                    {
                      trait_type: '',
                      value: '',
                    },
                  ],
                },
              ],
            }}
            onSubmit={handleSubmit}
          >
            {/* eslint-disable-next-line */}
            {({ values }: any) => (
              <Form>
                <Field
                  name="name"
                  validate={(value: string) => validatePresence('Name', value)}
                >
                  {/* eslint-disable-next-line */}
                  {({ field, form }: any) => (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <Input {...field} id="name" placeholder="name" />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field
                  name="symbol"
                  validate={(value: string) =>
                    validatePresence('symbol', value)
                  }
                >
                  {/* eslint-disable-next-line */}
                  {({ field, form }: any) => (
                    <FormControl
                      isRequired
                      mt="2"
                      isInvalid={form.errors.symbol && form.touched.symbol}
                    >
                      <FormLabel htmlFor="symbol">Symbol</FormLabel>
                      <Input {...field} id="symbol" placeholder="symbol" />
                      <FormErrorMessage>{form.errors.symbol}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <FieldArray name={'royalties'} validateOnChange={true}>
                  {({
                    push: pushRoyalty,
                    remove: removeRoyalty,
                  }: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  any) => (
                    <Box mt="2">
                      <FormLabel>Royalties</FormLabel>
                      {values.royalties.map(
                        (value: Royalty, indexAttribute: number) => (
                          <Flex key={`royalties[${indexAttribute}]`} mt="2">
                            <Box w="70%">
                              <Field
                                key={`royalties[${indexAttribute}].receiver`}
                                name={`royalties[${indexAttribute}].receiver`}
                                validate={(value: string) =>
                                  validateAddress(value)
                                }
                              >
                                {/* eslint-disable-next-line */}
                                {({ field, form }: any) => (
                                  <FormControl
                                    isInvalid={checkIfRoyaltyReceiverIsInvalid(
                                      form,
                                      indexAttribute
                                    )}
                                  >
                                    <Input
                                      {...field}
                                      id={`royalties[${indexAttribute}].receiver`}
                                      placeholder="Receiver"
                                    />
                                    <FormErrorMessage>
                                      {errorMessageRoyaltyReceiver(
                                        form,
                                        indexAttribute
                                      )}
                                    </FormErrorMessage>
                                  </FormControl>
                                )}
                              </Field>
                            </Box>

                            <Spacer />
                            <Box w="20%">
                              <Field
                                key={`royalties[${indexAttribute}].share`}
                                name={`royalties[${indexAttribute}].share`}
                              >
                                {/* eslint-disable-next-line */}
                                {({ field, form }: any) => (
                                  <FormControl
                                    isInvalid={checkIfRoyaltyValuesIsInvalid(
                                      form
                                    )}
                                  >
                                    <NumberInput
                                      min={0}
                                      max={100}
                                      precision={2}
                                      step={0.01}
                                    >
                                      <NumberInputField
                                        {...field}
                                        id={`royalties[${indexAttribute}].share`}
                                        placeholder="Share (%)"
                                      />
                                    </NumberInput>
                                    {checkIfLastRoyalty(
                                      form,
                                      indexAttribute
                                    ) ? (
                                      <FormErrorMessage>
                                        Percentage exceed 100%
                                      </FormErrorMessage>
                                    ) : null}
                                  </FormControl>
                                )}
                              </Field>
                            </Box>

                            <Center w="5%">
                              <Box maxW="36px">
                                <MdDelete
                                  aria-label="remove-royalty"
                                  onClick={() => removeRoyalty(indexAttribute)}
                                  fill="#FF4500"
                                  size={'80%'}
                                />
                              </Box>
                            </Center>
                          </Flex>
                        )
                      )}
                      <Box mt="2" h="2.5vh" w="2.5vh">
                        <Box maxW="24px">
                          <TiPlus
                            aria-label="add-royalty"
                            fill="#228B22"
                            size={'100%'}
                            onClick={() =>
                              pushRoyalty({
                                receiver: '',
                                share: 0,
                              })
                            }
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}
                </FieldArray>

                <Flex
                  my="2vh"
                  py="2vh"
                  border="1px"
                  borderColor="gray.200"
                  borderRadius={10}
                  w={{ base: '100vw', md: '60vw' }}
                  ml={{ base: '-5vw', md: '-5vw' }}
                >
                  <Center>
                    {values.nfts.length > 0 &&
                      (currentNftIndex > 0 ? (
                        <BsFillCaretLeftFill
                          aria-label="scroll-left"
                          style={{
                            width: '5vw',
                          }}
                          size={'2.5vw'}
                          onClick={scrollLeft}
                        />
                      ) : (
                        <Box w="5vw" />
                      ))}
                  </Center>

                  <Box
                    w={{ base: '90vw', md: '50vw' }}
                    hidden={values.nfts.length > 0 ? false : true}
                  >
                    <HStack
                      ref={containerRef}
                      spacing={0}
                      sx={{
                        '::-webkit-scrollbar': {
                          display: 'none',
                        },
                        scrollBehavior: 'smooth',
                        touchAction: 'none',
                        overflowY: 'hidden',
                        overflowX: 'scroll',
                        msOverflowStyle: 'none', // IE and Edge
                        scrollbarWidth: 'none', // Firefox
                      }}
                    >
                      <FieldArray name="nfts">
                        {/* eslint-disable-next-line */}
                        {({ push, remove }: any) => (
                          <>
                            {values.nfts.map((nft: NewNFT, index: number) => (
                              <Box
                                key={index}
                                minW={{ base: '90vw', md: '50vw' }}
                              >
                                <Center>
                                  <Heading size="md">Nft #{index}</Heading>
                                  <Box maxW="36px">
                                    <MdDelete
                                      aria-label="remove-nft"
                                      style={{
                                        marginLeft: '1vw',
                                      }}
                                      size={'100%'}
                                      fill="#FF4500"
                                      onClick={() =>
                                        handleRemoveNFT(remove, index)
                                      }
                                    />
                                  </Box>
                                </Center>
                                <Center>
                                  <Text size="xs" as="i" my="1vh">
                                    Note: Using the charachter{' '}
                                    <Text as="b">{'{id}'}</Text> in the name or
                                    description will be replaced by the NFT id
                                  </Text>
                                </Center>

                                <Field
                                  name={`nfts.${index}.image`}
                                  validate={(value: File) =>
                                    validateImage(value)
                                  }
                                >
                                  {/* eslint-disable-next-line */}
                                  {({ field, form }: any) => (
                                    <UploadImage
                                      currentImage={
                                        values.nfts[index].image &&
                                        values.nfts[index].image.size > 0
                                          ? values.nfts[index].image
                                          : undefined
                                      }
                                      /* eslint-disable-next-line */
                                      onUpload={(event: any) => {
                                        form.setFieldValue(
                                          `nfts.${index}.image`,
                                          event.currentTarget.files[0]
                                        )
                                      }}
                                      cancelUpload={() => {
                                        form.setFieldValue(
                                          `nfts.${index}.image`,
                                          new File([], '')
                                        )
                                      }}
                                    />
                                  )}
                                </Field>

                                <Field
                                  name={`nfts.${index}.name`}
                                  mt="2vh"
                                  validate={(value: string) =>
                                    validatePresence(`Name NFT ${index}`, value)
                                  }
                                >
                                  {/* eslint-disable-next-line */}
                                  {({ field, form }: any) => (
                                    <FormControl isRequired>
                                      <FormLabel htmlFor="name">Name</FormLabel>
                                      <Input
                                        {...field}
                                        id={`nfts.${index}.name`}
                                        placeholder="name"
                                      />
                                    </FormControl>
                                  )}
                                </Field>

                                <Field
                                  name={`nfts.${index}.description`}
                                  validate={(value: string) =>
                                    validatePresence(
                                      `Description NFT ${index}`,
                                      value
                                    )
                                  }
                                >
                                  {/* eslint-disable-next-line */}
                                  {({ field, form }: any) => (
                                    <FormControl isRequired>
                                      <FormLabel htmlFor="description">
                                        Description
                                      </FormLabel>
                                      <Input
                                        {...field}
                                        id={`nfts.${index}.description`}
                                        placeholder="description"
                                      />
                                    </FormControl>
                                  )}
                                </Field>

                                <FieldArray name={`nfts[${index}].attributes`}>
                                  {({
                                    push: pushAttribute,
                                    remove: removeAttribute,
                                  }: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                  any) => (
                                    <Box mt="2">
                                      <FormLabel>Attributes</FormLabel>
                                      {values.nfts[index].attributes.map(
                                        (
                                          value: Attribute,
                                          indexAttribute: number
                                        ) => (
                                          <Flex
                                            key={`nfts[${index}].attributes[${indexAttribute}]`}
                                            mt="2"
                                          >
                                            <Box w="45%">
                                              <Field
                                                key={`nfts[${index}].attributes[${indexAttribute}].trait_type`}
                                                name={`nfts[${index}].attributes[${indexAttribute}].trait_type`}
                                              >
                                                {/* eslint-disable-next-line */}
                                                {({ field, form }: any) => (
                                                  <FormControl>
                                                    <Input
                                                      {...field}
                                                      id={`nfts[${index}].attributes[${indexAttribute}].trait_type`}
                                                      placeholder="trait type"
                                                    />
                                                  </FormControl>
                                                )}
                                              </Field>
                                            </Box>

                                            <Spacer />
                                            <Box w="45%">
                                              <Field
                                                key={`nfts[${index}].attributes[${indexAttribute}].value`}
                                                name={`nfts[${index}].attributes[${indexAttribute}].value`}
                                              >
                                                {/* eslint-disable-next-line */}
                                                {({ field, form }: any) => (
                                                  <FormControl>
                                                    <Input
                                                      {...field}
                                                      id={`nfts[${index}]-attributes[${indexAttribute}].value`}
                                                      placeholder="value"
                                                    />
                                                  </FormControl>
                                                )}
                                              </Field>
                                            </Box>

                                            <Center w="5%">
                                              <Box maxW="36px">
                                                <MdDelete
                                                  aria-label="remove-attribute"
                                                  onClick={() =>
                                                    removeAttribute(
                                                      indexAttribute
                                                    )
                                                  }
                                                  fill="#FF4500"
                                                  size={'80%'}
                                                />
                                              </Box>
                                            </Center>
                                          </Flex>
                                        )
                                      )}
                                      <Box mt="2" h="2.5vh" w="2.5vh">
                                        <Box maxW="24px">
                                          <TiPlus
                                            aria-label="add-attribute"
                                            fill="#228B22"
                                            size={'100%'}
                                            onClick={() =>
                                              pushAttribute({
                                                trait_type: '',
                                                value: '',
                                              })
                                            }
                                          />
                                        </Box>
                                      </Box>
                                    </Box>
                                  )}
                                </FieldArray>
                              </Box>
                            ))}
                            <button
                              ref={addNFTref}
                              type="button"
                              onClick={() => handleAddNFT(push, scrollRight)}
                            />
                          </>
                        )}
                      </FieldArray>
                    </HStack>
                  </Box>
                  <Center>
                    {values.nfts.length > 0 &&
                      (values.nfts.length === currentNftIndex + 1 ? (
                        <Box maxW="24px">
                          <TiPlus
                            aria-label="add-nft"
                            fill="#228B22"
                            style={{
                              width: '5vw',
                            }}
                            size={'2.5vw'}
                            onClick={() => {
                              if (addNFTref.current) addNFTref.current.click()
                            }}
                          />
                        </Box>
                      ) : (
                        <BsFillCaretRightFill
                          style={{
                            width: '5vw',
                          }}
                          size={'2.5vw'}
                          onClick={scrollRight}
                        />
                      ))}
                  </Center>

                  {values.nfts.length === 0 && (
                    <Center flex="1">
                      <Box maxW="24px">
                        <TiPlus
                          aria-label="add-nft-when-empty"
                          fill="#228B22"
                          style={{
                            width: '5vw',
                          }}
                          size={'2.5vw'}
                          onClick={() => {
                            if (addNFTref.current) addNFTref.current.click()
                          }}
                        />
                      </Box>
                    </Center>
                  )}
                </Flex>

                <Center>
                  <LoadingButton
                    isLoading={isLoading}
                    loadingButtonProps={{
                      size: 'lg',
                      width: '50%',
                    }}
                  >
                    <ShadowButton
                      label={'Create Collection'}
                      bgColor={`${colors.sellChakraColor}.400`}
                      textColor={'white'}
                      shadowColor={colors.sellShadowColor}
                      hoverColor={`${colors.sellChakraColor}.500`}
                      focusColor={`${colors.sellChakraColor}.500`}
                      type="submit"
                      buttonProps={{
                        size: 'lg',
                        width: '50%',
                      }}
                    />
                  </LoadingButton>
                </Center>
              </Form>
            )}
          </Formik>
        </Box>
      </Center>
    </Box>
  )
}
