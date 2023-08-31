{
  /* eslint-disable */
}
import React from 'react'

import {
  Box,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { renderAddressWithTokenId } from '../../utils/SimplifiedAddress/SimplifiedAddress'

import { Royalty } from '../../types/components/Royalty'
import { Formik, FieldArray, Field, Form } from 'formik'
import { MdDelete } from 'react-icons/md'
import { TiPlus } from 'react-icons/ti'
import {
  checkIfRoyaltyReceiverIsInvalid,
  errorMessageRoyaltyReceiver,
  checkIfRoyaltyValuesIsInvalid,
  checkIfLastRoyalty,
} from '../../utils/FormikRoyalty/FormikRoyalty'
import { validateAddress } from '../../utils/ValidateAddress/ValidateAddress'
import LoadingButton from '../../components/LoadingButton/LoadingButton'
import ShadowButton from '../../components/ShadowButton/ShadowButton'
import { colors } from '../../styles/Colors'
import { NFTRoyaltiesProps } from '../../types/props/NFTRoyaltiesProps'
import WithdrawRoyaltyButton from '../../components/WithdrawRoyaltyButton/WithdrawRoyaltyButton'
import useNFTRoyalties from './useNFTRoyalties'
import QueryContainer from '../../utils/QueryContainer/QueryContainer'

export interface FormValues {
  royalties: Royalty[]
}

export default function NFTRoyalties({ address, tokenId }: NFTRoyaltiesProps) {
  const {
    isFetching,
    isError,
    nft,
    royalties,
    handleSubmit,
    handleRemoveCustom,
    isUpdateLoading,
    isRemoveCustomLoading,
  } = useNFTRoyalties({ address, tokenId })

  return (
    <Box>
      <QueryContainer isLoading={isFetching} isError={isError}>
        <Center flexDir={'column'}>
          <Heading>Royalties token {nft?.name}</Heading>
          <Heading size="md" mt="5">
            {renderAddressWithTokenId(
              address,
              tokenId,
              `/${address}/${tokenId}`
            )}
          </Heading>
        </Center>
        <Center px="2vw" py="2vh" flexDir="column">
          {royalties?.supportsErc2981 ? (
            <Box>
              <Formik
                enableReinitialize
                initialValues={{
                  royalties:
                    royalties.royalties.length > 0
                      ? royalties.royalties
                      : [{ receiver: '', share: 0 }],
                }}
                onSubmit={handleSubmit}
              >
                {({ values }) => (
                  <Form>
                    <FieldArray name={'royalties'} validateOnChange={true}>
                      {({
                        push: pushRoyalty,
                        remove: removeRoyalty,
                      }: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                      any) => (
                        <Box
                          mt="2"
                          maxW={{ sm: '600px', md: '2000px' }}
                          w={{ sm: '100vw', md: '80vw', lg: '60vw' }}
                        >
                          <FormLabel>Royalties</FormLabel>
                          {values.royalties.map(
                            (value: Royalty, indexAttribute: number) => (
                              <Flex key={`royalties[${indexAttribute}]`} mt="2">
                                <Box w="59%">
                                  <Field
                                    key={`royalties[${indexAttribute}].receiver`}
                                    name={`royalties[${indexAttribute}].receiver`}
                                    validate={(value: string) =>
                                      validateAddress(value)
                                    }
                                  >
                                    {({ field, form }: any) => (
                                      <FormControl
                                        isInvalid={checkIfRoyaltyReceiverIsInvalid(
                                          form,
                                          indexAttribute
                                        )}
                                      >
                                        <Input
                                          isDisabled={
                                            !royalties.supportsErc2981MultiReceiver
                                          }
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
                                <Box w="29%">
                                  <Field
                                    key={`royalties[${indexAttribute}].share`}
                                    name={`royalties[${indexAttribute}].share`}
                                  >
                                    {({ field, form }: any) => (
                                      <FormControl
                                        isInvalid={checkIfRoyaltyValuesIsInvalid(
                                          form
                                        )}
                                      >
                                        <NumberInput
                                          isDisabled={
                                            !royalties.supportsErc2981MultiReceiver
                                          }
                                          min={0}
                                          max={100}
                                          precision={2}
                                          step={0.01}
                                          onChange={(value) => {
                                            form.setFieldValue(
                                              `royalties[${indexAttribute}].share`,
                                              value
                                            )
                                          }}
                                          value={field.value}
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

                                <Center w="9%">
                                  {royalties.supportsErc2981MultiReceiver && (
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
                                  )}
                                </Center>
                              </Flex>
                            )
                          )}
                          <Box mt="2" h="2.5vh" w="2.5vh">
                            {royalties.supportsErc2981MultiReceiver && (
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
                            )}
                          </Box>
                        </Box>
                      )}
                    </FieldArray>
                    {royalties.supportsErc2981MultiReceiver && (
                      <Center flexDir={'column'}>
                        {royalties.isCollectionDefault && (
                          <Text as="i" my="2vh">
                            The above data are the default royalties for the
                            collection. Changing this data will create custom
                            royalties for the token
                          </Text>
                        )}
                        {royalties.hasPaymentSplitter && (
                          <Text as="i" my="2vh">
                            Make sure to withdraw all the funds before updating.
                            If you don't, the funds may be lost
                          </Text>
                        )}
                        <LoadingButton
                          isLoading={isUpdateLoading}
                          loadingButtonProps={{
                            size: 'lg',
                            w: '15em',
                            maxW: '15em',
                          }}
                        >
                          <ShadowButton
                            label={'Update Royalties'}
                            bgColor={`${colors.sellChakraColor}.400`}
                            textColor={'white'}
                            shadowColor={colors.sellShadowColor}
                            hoverColor={`${colors.sellChakraColor}.500`}
                            focusColor={`${colors.sellChakraColor}.500`}
                            type="submit"
                            isDisabled={values.royalties.length === 0}
                            buttonProps={{
                              size: 'lg',
                              w: '15em',
                              maxW: '15em',
                            }}
                          />
                        </LoadingButton>
                      </Center>
                    )}
                  </Form>
                )}
              </Formik>

              {royalties.supportsErc2981MultiReceiver && (
                <>
                  <Divider my="4vh" mx="2vw" />
                  <Center flexDir="column">
                    <Heading size="md" mb="5" color={'gray.600'}>
                      Other actions
                    </Heading>

                    <LoadingButton
                      isLoading={isRemoveCustomLoading}
                      loadingButtonProps={{
                        size: 'lg',
                        w: '15em',
                        maxW: '15em',
                      }}
                    >
                      <ShadowButton
                        label={'Remove custom royalty'}
                        bgColor={`${colors.cancelChakraColor}.400`}
                        textColor={'white'}
                        shadowColor={colors.cancelShadowColor}
                        hoverColor={`${colors.cancelChakraColor}.500`}
                        focusColor={`${colors.cancelChakraColor}.500`}
                        onClick={handleRemoveCustom}
                        buttonProps={{
                          size: 'lg',
                          w: '15em',
                          maxW: '15em',
                        }}
                      />
                    </LoadingButton>

                    <WithdrawRoyaltyButton
                      collectionAddress={address}
                      tokenId={tokenId}
                      buttonProps={{
                        size: 'lg',
                        w: '15em',
                        maxW: '15em',
                        mt: '2vh',
                      }}
                    />
                  </Center>
                </>
              )}

              {!royalties.supportsErc2981MultiReceiver && (
                <Center>
                  <Text>
                    Royalties are not editable because this collection was not
                    created with Shopychange
                  </Text>
                </Center>
              )}
            </Box>
          ) : (
            <Center>
              <Text>
                Unable to find royalty information for this collection because
                it does not support ERC2981 standard
              </Text>
            </Center>
          )}
        </Center>
      </QueryContainer>
    </Box>
  )
}
