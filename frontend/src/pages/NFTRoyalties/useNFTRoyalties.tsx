{
  /* eslint-disable */
}
import { useToast } from '@chakra-ui/react'
import { useUserContext } from '../../context/userContext'
import { NFTRoyaltiesProps } from '../../types/props/NFTRoyaltiesProps'
import { useState, useEffect } from 'react'
import {
  handlerQueryErrorCatch,
  NFTRoyaltyQuery,
} from '../../services/BackendService'
import {
  updateTokenRoyalties,
  waitTransaction,
  resetTokenRoyalty,
} from '../../services/BlockchainService'
import { NFT } from '../../types/components/NFT'
import { RoyaltyToken } from '../../types/components/RoyaltyToken'
import useFetching from '../../hooks/useFetching'
import useLoading from '../../hooks/useLoading'
import { FormValues } from './NFTRoyalties'

export default function useNFTRoyalties({
  address,
  tokenId,
}: NFTRoyaltiesProps) {
  const toast = useToast()
  const { userAddress, blockchainNetworkId } = useUserContext()

  const { isFetching, setIsFetching, isError, setIsError } = useFetching()
  const { isLoading: isUpdateLoading, setIsLoading: setIsUpdateLoading } =
    useLoading()
  const {
    isLoading: isRemoveCustomLoading,
    setIsLoading: setIsRemoveCustomLoading,
  } = useLoading()
  const [nft, setNfts] = useState<NFT>()
  const [royalties, setRoyalties] = useState<RoyaltyToken>()

  const fetchRoyalties = async () => {
    if (!userAddress || !blockchainNetworkId) return

    const response = await handlerQueryErrorCatch(
      NFTRoyaltyQuery(blockchainNetworkId, address, tokenId)
    )

    if (response.error) {
      setIsError(true)
      setIsFetching(false)
      return
    }

    const result = response.result

    setNfts(result.nftComplete.nft)
    setRoyalties(result.royaltyToken)
  }

  useEffect(() => {
    fetchRoyalties().then(() => {
      setIsFetching(false)
    })
  }, [address])

  const handleSubmit = async (values: FormValues) => {
    setIsUpdateLoading(true)
    updateTokenRoyalties(address, tokenId, values.royalties)
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

  const handleRemoveCustom = async () => {
    setIsRemoveCustomLoading(true)
    resetTokenRoyalty(address, tokenId)
      .then(waitTransaction)
      .then(() => {
        setIsRemoveCustomLoading(false)
        fetchRoyalties().then(() => {
          toast({
            variant: 'solid',
            title: 'Transaction successful',
            description: 'Custom royalties removed',
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
        setIsRemoveCustomLoading(false)
      })
  }

  return {
    isFetching,
    isError,
    nft,
    royalties,
    handleSubmit,
    handleRemoveCustom,
    isUpdateLoading,
    isRemoveCustomLoading,
  }
}
