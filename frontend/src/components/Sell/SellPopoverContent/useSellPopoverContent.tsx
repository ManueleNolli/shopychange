import { useEffect, useState } from 'react'

import {
  handlerQueryErrorCatch,
  isMarketplaceApprovedQuery,
} from '../../../services/BackendService'

import {
  askApproval,
  waitTransaction,
  createSale,
} from '../../../services/BlockchainService'

import { useUserContext } from '../../../context/userContext'

import { useToast } from '@chakra-ui/react'
import { SellPopoverProps } from '../../../types/props/SellPopoverProps'
import useLoading from '../../../hooks/useLoading'
import useFetching from '../../../hooks/useFetching'

export default function useSellPopoverContent({
  nft,
  onClose,
  onSucess,
}: SellPopoverProps) {
  const toast = useToast()
  const { userAddress, blockchainNetworkId } = useUserContext()
  const { isLoading, setIsLoading } = useLoading()
  const { isFetching, setIsFetching, isError, setIsError } = useFetching()
  const [price, setPrice] = useState<number>(0)
  const [isApproved, setIsApproved] = useState<boolean>(false)

  useEffect(() => {
    if (!userAddress || !blockchainNetworkId) return

    const fetchIsApproved = async () => {
      setIsFetching(true)
      const response = await handlerQueryErrorCatch(
        isMarketplaceApprovedQuery(
          blockchainNetworkId,
          nft.contractAddress,
          nft.tokenId
        )
      )
      if (response.error) {
        setIsError(true)
        setIsFetching(false)
        return
      }

      setIsApproved(response.result.isMarketplaceApproved)
      setIsFetching(false)
    }

    fetchIsApproved()
  }, [])

  const approve = async () => {
    if (!userAddress || !blockchainNetworkId) return

    setIsLoading(true)
    return (
      askApproval(blockchainNetworkId, nft.contractAddress, nft.tokenId)
        .then(waitTransaction)
        .then(() => {
          setIsLoading(false)
          setIsApproved(true)
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    )
  }

  const sell = async () => {
    if (!userAddress || !blockchainNetworkId) return

    setIsLoading(true)
    return (
      createSale(blockchainNetworkId, nft.contractAddress, nft.tokenId, price)
        .then(waitTransaction)
        .then(() => {
          setIsLoading(false)
          onSucess()
          onClose()
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    )
  }

  return {
    isFetching,
    isError,
    isApproved,
    isLoading,
    price,
    setPrice,
    approve,
    sell,
  }
}
