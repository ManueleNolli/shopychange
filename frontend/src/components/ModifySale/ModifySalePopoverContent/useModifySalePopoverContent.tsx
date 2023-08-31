import { useState } from 'react'

import { useToast } from '@chakra-ui/react'
import {
  modifySale,
  waitTransaction,
} from '../../../services/BlockchainService'

import { useUserContext } from '../../../context/userContext'
import useLoading from '../../../hooks/useLoading'
import { ModifySalePopoverContentProps } from '../../../types/props/ModifySalePopoverContentProps'

export default function useModifySalePopoverContent({
  nft,
  onClose,
  onSucess,
  actualPrice,
}: ModifySalePopoverContentProps) {
  const toast = useToast()
  const { userAddress, blockchainNetworkId } = useUserContext()
  const { isLoading, setIsLoading } = useLoading()
  const [newPrice, setnewPrice] = useState<number>(actualPrice)
  const [diffPercentage, setDiffPercentage] = useState<number>(0)

  const onPriceChange = (value: string) => {
    if (value) {
      const valueNum = parseFloat(value)
      setDiffPercentage(((valueNum - actualPrice) / actualPrice) * 100)
      setnewPrice(valueNum)
    }
  }

  const modify = async () => {
    if (!userAddress || !blockchainNetworkId) return
    if (newPrice && newPrice != actualPrice) {
      setIsLoading(true)
      return modifySale(
        blockchainNetworkId,
        nft.contractAddress,
        nft.tokenId,
        newPrice
      )
        .then(waitTransaction)
        .then(() => {
          setIsLoading(false)
          onSucess()
          onClose()
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
  }

  return {
    isLoading,
    newPrice,
    diffPercentage,
    onPriceChange,
    modify,
  }
}
