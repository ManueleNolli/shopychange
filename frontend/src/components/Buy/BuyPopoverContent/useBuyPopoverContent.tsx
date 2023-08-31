import { useToast } from '@chakra-ui/react'
import { useUserContext } from '../../../context/userContext'
import useLoading from '../../../hooks/useLoading'

import {
  handlerMutation,
  AddNFTCollectionsMutation,
} from '../../../services/BackendService'

import { waitTransaction, buy } from '../../../services/BlockchainService'

import { BuyPopoverProps } from '../../../types/props/BuyPopoverContentProps'

export default function useBuyPopoverContent({
  nft,
  price,
  onClose,
  onSuccess,
}: BuyPopoverProps) {
  const toast = useToast()
  const { userAddress, blockchainNetworkId } = useUserContext()
  const { isLoading, setIsLoading } = useLoading()

  const buyToken = async () => {
    if (!userAddress || !blockchainNetworkId) return

    setIsLoading(true)
    return (
      buy(blockchainNetworkId, nft.contractAddress, nft.tokenId, price)
        .then(waitTransaction)
        .then(() => {
          onSuccess()
          onClose()
          setIsLoading(false)
        })
        .then(() => {
          handlerMutation(
            AddNFTCollectionsMutation([nft.contractAddress], userAddress)
          )
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

  return { isLoading, buyToken }
}
