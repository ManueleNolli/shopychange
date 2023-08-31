{
  /* eslint-disable */
}
import { useEffect, useState } from 'react'
import { useUserContext } from '../../context/userContext'
import useFetching from '../../hooks/useFetching'
import { RoyaltyCollection } from '../../types/components/RoyaltyCollection'
import { useToast } from '@chakra-ui/react'
import {
  collectionRoyaltyQuery,
  handlerQueryErrorCatch,
} from '../../services/BackendService'
import {
  updateCollectionRoyalties,
  waitTransaction,
  resetDefaultCollectionRoyalties,
} from '../../services/BlockchainService'
import useLoading from '../../hooks/useLoading'
import { FormValues } from './CollectionRoyalties'
import { Contract } from '../../types/components/Contract'

export default function useCollectionRoyalties(address: string) {
  const toast = useToast()
  const { userAddress, blockchainNetworkId } = useUserContext()
  const { isFetching, setIsFetching, isError, setIsError } = useFetching()

  const { isLoading: isUpdateLoading, setIsLoading: setIsUpdateLoading } =
    useLoading()
  const {
    isLoading: isRemoveDefaultLoading,
    setIsLoading: setIsRemoveDefaultLoading,
  } = useLoading()
  const [collection, setCollection] = useState<Contract>()
  const [royalties, setRoyalties] = useState<RoyaltyCollection>()

  const fetchRoyalties = async () => {
    if (!userAddress || !blockchainNetworkId) return

    const response = await handlerQueryErrorCatch(
      collectionRoyaltyQuery(blockchainNetworkId, address)
    )

    if (response.error) {
      setIsError(true)
      setIsFetching(false)
      return
    }

    const result = response.result
    setCollection(result.contract)
    setRoyalties(result.royaltyCollection)
  }

  useEffect(() => {
    fetchRoyalties().then(() => {
      setIsFetching(false)
    })
  }, [address])

  const handleSubmit = async (values: FormValues) => {
    setIsUpdateLoading(true)
    updateCollectionRoyalties(address, values.royalties)
      .then(waitTransaction)
      .then(() => {
        setIsUpdateLoading(false)
        fetchRoyalties().then(() => {
          toast({
            variant: 'solid',
            title: 'Transaction successful',
            description: 'Royalties updated',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        })
      })
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
        setIsUpdateLoading(false)
      })
  }

  const handleRemoveDefault = async () => {
    setIsRemoveDefaultLoading(true)
    resetDefaultCollectionRoyalties(address)
      .then(waitTransaction)
      .then(() => {
        setIsRemoveDefaultLoading(false)
        fetchRoyalties().then(() => {
          toast({
            variant: 'solid',
            title: 'Transaction successful',
            description: 'Default royalties removed',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        })
      })
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
        setIsRemoveDefaultLoading(false)
      })
  }

  return {
    isFetching,
    isError,
    isUpdateLoading,
    isRemoveDefaultLoading,
    collection,
    royalties,
    handleSubmit,
    handleRemoveDefault,
  }
}
