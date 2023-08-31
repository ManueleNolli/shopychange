import { useToast } from '@chakra-ui/react'

import {
  waitTransaction,
  cancelSale,
} from '../../../services/BlockchainService'

import { useUserContext } from '../../../context/userContext'
import useLoading from '../../../hooks/useLoading'
import { CancelSalePopoverProps } from '../../../types/props/CancelSalePopoverProps'

export default function useCancelSalePopoverContent({
  nft,
  onClose,
  onSuccess,
}: CancelSalePopoverProps) {
  const toast = useToast()
  const { userAddress, blockchainNetworkId } = useUserContext()
  const { isLoading, setIsLoading } = useLoading()

  const cancel = async () => {
    if (!userAddress || !blockchainNetworkId) return

    setIsLoading(true)
    return (
      cancelSale(blockchainNetworkId, nft.contractAddress, nft.tokenId)
        .then(waitTransaction)
        .then(() => {
          setIsLoading(false)
          onSuccess()
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

  return { isLoading, cancel }
}
