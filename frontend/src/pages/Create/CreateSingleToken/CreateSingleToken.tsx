{
  /* eslint-disable */
}
import React from 'react'

import {
  Box,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  Checkbox,
} from '@chakra-ui/react'

import { MdDelete } from 'react-icons/md'
import { TiPlus } from 'react-icons/ti'

import UploadImage from '../../../components/UploadImage/UploadImage'
import LoadingButton from '../../../components/LoadingButton/LoadingButton'
import ShadowButton from '../../../components/ShadowButton/ShadowButton'
import { colors } from '../../../styles/Colors'

import { Attribute } from '../../../types/components/NewNFT'

import { validatePresence } from '../../../utils/ValidatePresence/validatePresence'
import { validateImage } from '../../../utils/ValidateImage/validateImage'

import { Formik, Form, Field, FieldArray } from 'formik'
import { Royalty } from '../../../types/components/Royalty'
import { validateAddress } from '../../../utils/ValidateAddress/ValidateAddress'
import {
  checkIfRoyaltyReceiverIsInvalid,
  errorMessageRoyaltyReceiver,
  checkIfRoyaltyValuesIsInvalid,
  checkIfLastRoyalty,
} from '../../../utils/FormikRoyalty/FormikRoyalty'
import useCreateSingleToken from './useCreateSingleToken'
export interface FormValues {
  image: File
  name: string
  description: string
  contractAddress: string
  attributes: Attribute[]
  useDefaultRoyalties: boolean
  royalties: Royalty[]
}

export default function CreateSingleToken() {
  const { isLoading, contracts, handleSubmit } = useCreateSingleToken()

  return (
    <Box>
      <Center>
        <Heading>New Single NFT</Heading>
      </Center>

      <Center mt="2vh">
        <Box w={{ base: '90vw', md: '50vw' }}>
          <Formik
            enableReinitialize
            initialValues={{
              image: new File([], ''),
              name: '',
              description: '',
              attributes: [
                {
                  trait_type: '',
                  value: '',
                },
              ],
              contractAddress: contracts[0]?.address,
              useDefaultRoyalties: false,
              royalties: [
                {
                  receiver: '',
                  share: NaN,
                },
              ],
            }}
            onSubmit={handleSubmit}
          >
            {/* eslint-disable-next-line */}
            {({ values }: any) => (
              <Form>
                <Field
                  name="image"
                  validate={(value: File) => validateImage(value)}
                >
                  {/* eslint-disable-next-line */}
                  {({ field, form }: any) => (
                    <UploadImage
                      currentImage={
                        values.image && values.image.size > 0
                          ? values.image
                          : undefined
                      }
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onUpload={(event: any) => {
                        form.setFieldValue('image', event.target.files[0])
                      }}
                      cancelUpload={() => {
                        form.setFieldValue('image', new File([], ''))
                      }}
                    />
                  )}
                </Field>

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
                  name="description"
                  validate={(value: string) =>
                    validatePresence('Description', value)
                  }
                >
                  {/* eslint-disable-next-line */}
                  {({ field, form }: any) => (
                    <FormControl
                      isRequired
                      mt="2"
                      isInvalid={
                        form.errors.description && form.touched.description
                      }
                    >
                      <FormLabel htmlFor="description">Description</FormLabel>
                      <Textarea
                        {...field}
                        id="description"
                        placeholder="description"
                      />
                      <FormErrorMessage>
                        {form.errors.description}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="contractAddress">
                  {/* eslint-disable-next-line */}
                  {({ field, form }: any) => (
                    <FormControl mt="2" isRequired>
                      <FormLabel htmlFor="contractAddress">
                        Collection
                      </FormLabel>
                      <Select {...field} id="contractAddress" size="md">
                        {contracts.map((contract) => (
                          <option
                            key={contract.address}
                            value={contract.address}
                          >
                            {contract.name} - {contract.symbol}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Field>

                <FieldArray name="attributes">
                  {/* eslint-disable-next-line */}
                  {({ push, remove }: any) => (
                    <Box mt="2">
                      <FormLabel>Attributes</FormLabel>
                      {values.attributes.map(
                        (value: Attribute, index: number) => (
                          <Flex key={index} mt="2">
                            <Box w="48%">
                              <Field
                                key={`attributes[${index}].trait_type`}
                                name={`attributes[${index}].trait_type`}
                              >
                                {/* eslint-disable-next-line */}
                                {({ field, form }: any) => (
                                  <FormControl>
                                    <Input
                                      {...field}
                                      id={`attributes[${index}].trait_type`}
                                      placeholder="trait type"
                                    />
                                  </FormControl>
                                )}
                              </Field>
                            </Box>

                            <Spacer />
                            <Box w="48%">
                              <Field
                                key={`attributes[${index}].value`}
                                name={`attributes[${index}].value`}
                              >
                                {/* eslint-disable-next-line */}
                                {({ field, form }: any) => (
                                  <FormControl>
                                    <Input
                                      {...field}
                                      id={`attributes[${index}].value`}
                                      placeholder="value"
                                    />
                                  </FormControl>
                                )}
                              </Field>
                            </Box>

                            <Center mr="-5%" w="5%">
                              <Box maxW="36px">
                                <MdDelete
                                  aria-label="remove-attribute"
                                  onClick={() => remove(index)}
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
                              push({
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

                <Field name="useDefaultRoyalties">
                  {/* eslint-disable-next-line */}
                  {({ field, form }: any) => (
                    <FormControl my="4">
                      <Checkbox
                        {...field}
                        id="useDefaultRoyalties"
                        onChange={
                          /* eslint-disable-next-line */
                          (event: any) => {
                            if (event.target.checked) {
                              form.setFieldValue('royalties', [])
                            } else {
                              form.setFieldValue('royalties', [
                                {
                                  receiver: '',
                                  share: NaN,
                                },
                              ])
                            }
                            form.setFieldValue(
                              'useDefaultRoyalties',
                              event.target.checked
                            )
                          }
                        }
                      >
                        Use default royalties
                      </Checkbox>
                    </FormControl>
                  )}
                </Field>
                {!values.useDefaultRoyalties && (
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
                              <Box w="28%">
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

                              <Center mr="-5%" w="5%">
                                <Box maxW="36px">
                                  <MdDelete
                                    aria-label="remove-royalty"
                                    onClick={() =>
                                      removeRoyalty(indexAttribute)
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
                )}

                <Center>
                  <LoadingButton
                    isLoading={isLoading}
                    loadingButtonProps={{
                      size: 'lg',
                      width: '50%',
                    }}
                  >
                    <ShadowButton
                      label={'Create NFT'}
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
