import React from 'react'
import { WithdrawRoyaltyButtonProps } from '../../types/props/WithdrawRoyaltyButtonProps'
import RoyaltiesCheck from '../../utils/RoyaltiesCheck/RoyaltiesCheck'

import { colors } from '../../styles/Colors'
import LoadingButton from '../LoadingButton/LoadingButton'
import ShadowButton from '../ShadowButton/ShadowButton'

import useWithdrawRoyaltyButton from './useWithdrawRoyaltyButton'
import QueryContainer from '../../utils/QueryContainer/QueryContainer'

export default function WithdrawRoyaltyButton({
  collectionAddress,
  tokenId,
  buttonProps,
}: WithdrawRoyaltyButtonProps) {
  const {
    isFetching,
    isError,
    withdrawValue,
    isLoading,
    hasPaymentSplitter,
    withdraw,
  } = useWithdrawRoyaltyButton({ collectionAddress, tokenId })

  if (!hasPaymentSplitter) {
    return <></>
  } else {
    return (
      <RoyaltiesCheck
        collectionAddress={collectionAddress}
        tokenId={tokenId}
        redirectHome={false}
      >
        <QueryContainer isLoading={isFetching} isError={isError}>
          <LoadingButton
            isLoading={isLoading}
            loadingButtonProps={
              buttonProps ? { ...buttonProps } : { maxW: '20em', w: '20em' }
            }
          >
            <ShadowButton
              label={`Withdraw ${Number(withdrawValue.toFixed(4))} ETH`}
              bgColor={`${colors.primaryChakraColor}.400`}
              textColor={'white'}
              shadowColor={colors.primaryShadowColor}
              hoverColor={`${colors.primaryChakraColor}.500`}
              focusColor={`${colors.primaryChakraColor}.500`}
              onClick={withdraw}
              buttonProps={
                buttonProps ? { ...buttonProps } : { maxW: '20em', w: '20em' }
              }
            />
          </LoadingButton>
        </QueryContainer>
      </RoyaltiesCheck>
    )
  }
}
