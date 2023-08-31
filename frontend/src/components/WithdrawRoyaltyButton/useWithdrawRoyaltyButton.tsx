import { useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useUserContext } from '../../context/userContext'
import {
  tokenRoyaltiesQuery,
  collectionRoyaltiesQuery,
  handlerQueryErrorCatch,
} from '../../services/BackendService'
import {
  withdrawRoyalty,
  waitTransaction,
} from '../../services/BlockchainService'
import { WithdrawReceiver } from '../../types/components/WithdrawReceiver'
import { WithdrawRoyaltyButtonProps } from '../../types/props/WithdrawRoyaltyButtonProps'
import useLoading from '../../hooks/useLoading'
import useFetching from '../../hooks/useFetching'

export default function useWithdrawRoyaltyButton({
  collectionAddress,
  tokenId,
}: WithdrawRoyaltyButtonProps) {
  const { userAddress, blockchainNetworkId } = useUserContext()

  const toast = useToast()
  const [withdrawValue, setWithdrawValue] = useState(0)
  const { isLoading, setIsLoading } = useLoading()
  const { isFetching, setIsFetching, isError, setIsError } = useFetching()
  const [withdrawInfo, setWithdrawInfo] = useState({
    paymentSplitterAddress: '',
    index: 0,
  })
  const [hasPaymentSplitter, setHasPaymentSplitter] = useState(false)

  useEffect(() => {
    const fetchReceiver = async () => {
      if (!userAddress || !blockchainNetworkId) return

      let receivers = []
      let paymentSplitterAddress = ''

      if (tokenId !== undefined) {
        const response = await handlerQueryErrorCatch(
          tokenRoyaltiesQuery(blockchainNetworkId, collectionAddress, tokenId)
        )

        if (response.error) {
          setIsFetching(false)
          setIsError(true)
          return
        }

        const result = response.result
        receivers = result.withdrawRoyaltyToken.receivers
        paymentSplitterAddress =
          result.withdrawRoyaltyToken.paymentSplitterAddress
      } else {
        const response = await handlerQueryErrorCatch(
          collectionRoyaltiesQuery(blockchainNetworkId, collectionAddress)
        )
        if (response.error) {
          setIsFetching(false)
          setIsError(true)
          return
        }

        const result = response.result

        receivers = result.withdrawRoyaltyCollection.receivers
        paymentSplitterAddress =
          result.withdrawRoyaltyCollection.paymentSplitterAddress
      }
      if (paymentSplitterAddress === null) {
        return
      }

      const filter = receivers.filter((receiver: WithdrawReceiver) => {
        return receiver.receiver === userAddress
      })

      if (filter.length > 0) {
        const index = receivers.indexOf(filter[0])
        setWithdrawValue(filter[0].amount)
        setWithdrawInfo({
          paymentSplitterAddress: paymentSplitterAddress,
          index: index,
        })
        setHasPaymentSplitter(true)
      }

      setIsFetching(false)
    }
    fetchReceiver()
  }, [userAddress])

  const withdraw = async () => {
    setIsLoading(true)
    withdrawRoyalty(withdrawInfo.paymentSplitterAddress, withdrawInfo.index)
      .then(waitTransaction)
      .then(() => {
        setIsLoading(false)
        setWithdrawValue(0)
        toast({
          variant: 'solid',
          title: 'Transaction successful',
          description: 'Royalties withdrawn successfully',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      }) // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((err: any) => {
        // First phrase of the error message is enough
        const errorMessage = err.message.split('.')[0]
        toast({
          variant: 'solid',
          title: 'Transaction failed',
          description: errorMessage,
          status: 'warning',
          duration: 9000,
          isClosable: true,
        })
        setIsLoading(false)
      })
  }

  return {
    isFetching,
    isError,
    withdrawValue,
    hasPaymentSplitter,
    isLoading,
    withdraw,
  }
}
