import React from 'react'

import {
  Center,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import useObservedCollections from './useObservedCollections'
import { Formik, FieldArray, Field, Form } from 'formik'
import { MdDelete } from 'react-icons/md'
import { TiPlus } from 'react-icons/ti'
import { validateAddress } from '../../../utils/ValidateAddress/ValidateAddress'
import LoadingButton from '../../../components/LoadingButton/LoadingButton'
import ShadowButton from '../../../components/ShadowButton/ShadowButton'
import { colors } from '../../../styles/Colors'
import QueryContainer from '../../../utils/QueryContainer/QueryContainer'

export default function ObservedCollections() {
  const {
    observedCollections,
    isObservedFetching,
    isObservedError,
    handleSubmit,
  } = useObservedCollections()

  return (
    <Box mt="2vh">
      <QueryContainer isLoading={isObservedFetching} isError={isObservedError}>
        <Center>
          <Formik
            enableReinitialize
            onSubmit={handleSubmit}
            initialValues={{
              observedCollections:
                observedCollections.length > 0 ? observedCollections : [''],
            }}
          >
            {({ values }) => (
              <Form>
                <FieldArray
                  validateOnChange={true}
                  name={'observedCollections'}
                >
                  {({
                    push,
                    remove,
                  }: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  any) => (
                    <Box
                      mt="2"
                      maxW={{ sm: '600px', md: '1000px' }}
                      w={{ sm: '100vw', md: '60vw', lg: '50vw' }}
                    >
                      <FormLabel>Royalties</FormLabel>
                      {values.observedCollections.map(
                        (value: string, indexAttribute: number) => (
                          <Flex
                            key={`observedCollections[${indexAttribute}]`}
                            mt="2"
                          >
                            <Box w="88%">
                              <Field
                                key={`observedCollections[${indexAttribute}]`}
                                name={`observedCollections[${indexAttribute}]`}
                                validate={(value: string) =>
                                  validateAddress(value)
                                }
                              >
                                {/* eslint-disable-next-line
                                @typescript-eslint/no-explicit-any */}
                                {({ field, form }: any) => (
                                  <FormControl
                                    isInvalid={
                                      form.errors.observedCollections &&
                                      form.touched.observedCollections &&
                                      form.errors.observedCollections[
                                        indexAttribute
                                      ]
                                    }
                                  >
                                    <Input
                                      {...field}
                                      id={`observedCollections[${indexAttribute}]`}
                                      placeholder="Collection Address"
                                    />
                                    <FormErrorMessage>
                                      {form.errors.observedCollections &&
                                        form.touched.observedCollections &&
                                        form.errors.observedCollections[
                                          indexAttribute
                                        ]}
                                    </FormErrorMessage>
                                  </FormControl>
                                )}
                              </Field>
                            </Box>

                            <Center w="8%">
                              <Box maxW="36px">
                                <MdDelete
                                  aria-label="remove-address"
                                  onClick={() => remove(indexAttribute)}
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
                            aria-label="add-address"
                            fill="#228B22"
                            size={'100%'}
                            onClick={() => push('')}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}
                </FieldArray>
                <Center>
                  <LoadingButton
                    isLoading={false}
                    loadingButtonProps={{
                      size: 'lg',
                      w: '18em',
                      maxW: '18em',
                    }}
                  >
                    <ShadowButton
                      label={'Update Observed Collections'}
                      bgColor={`${colors.sellChakraColor}.400`}
                      textColor={'white'}
                      shadowColor={colors.sellShadowColor}
                      hoverColor={`${colors.sellChakraColor}.500`}
                      focusColor={`${colors.sellChakraColor}.500`}
                      type="submit"
                      buttonProps={{
                        size: 'lg',
                        w: '18em',
                        maxW: '18em',
                      }}
                    />
                  </LoadingButton>
                </Center>
              </Form>
            )}
          </Formik>
        </Center>
      </QueryContainer>
    </Box>
  )
}
