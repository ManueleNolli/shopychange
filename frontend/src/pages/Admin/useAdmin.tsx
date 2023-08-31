import { useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useUserContext } from '../../context/userContext'
import {
  AdminQuery,
  salesQuery,
  handlerQueryErrorCatch,
} from '../../services/BackendService'
import {
  cleanMarketplaceStorage,
  cancelSale,
  setNewRoyalty,
  waitTransaction,
  withdrawOwner,
  withdrawTo,
  withdrawToAmount as withdrawToAmountService,
} from '../../services/BlockchainService'
import { NFT } from '../../types/components/NFT'
import useLoading from '../../hooks/useLoading'

export default function useAdmin() {
  const toast = useToast()
  const { userAddress, blockchainNetworkId } = useUserContext()
  const [royaltyValue, setRoyaltyValue] = useState<number | null>(null)
  const [marketplaceBalance, setMarketplaceBalance] = useState<number | null>(
    null
  )
  const [newRoyaltyValue, setNewRoyaltyValue] = useState<number>(0)

  const {
    isLoading: isNewRoyaltyValueLoading,
    setIsLoading: setIsNewRoyaltyValueLoading,
  } = useLoading()
  const {
    isLoading: isCleanStorageLoading,
    setIsLoading: setIsCleanStorageLoading,
  } = useLoading()
  const {
    isLoading: isCancelSaleLoading,
    setIsLoading: setIsCancelSaleLoading,
  } = useLoading()
  const { isLoading: isWithdrawLoading, setIsLoading: setIsWithdrawLoading } =
    useLoading()
  const {
    isLoading: isWithdrawToLoading,
    setIsLoading: setIsWithdrawToLoading,
  } = useLoading()
  const {
    isLoading: isWithdrawToAmountLoading,
    setIsLoading: setIsWithdrawToAmountLoading,
  } = useLoading()

  const [sales, setSales] = useState<NFT[]>([])
  const [saleToCancel, setSaleToCancel] = useState<NFT | null>(null)

  const getRoyaltyValue = async () => {
    if (!userAddress || !blockchainNetworkId) return

    const response = await handlerQueryErrorCatch(
      AdminQuery(blockchainNetworkId)
    )

    if (response.error) {
      return
    }

    const result = response.result
    setRoyaltyValue(result.marketplaceRoyalty)
    setMarketplaceBalance(result.marketplaceBalance)
  }

  const getSales = async () => {
    if (!userAddress || !blockchainNetworkId) return

    setIsCancelSaleLoading(true)
    const response = await handlerQueryErrorCatch(
      salesQuery(blockchainNetworkId)
    )

    if (response.error) {
      return
    }

    const result = response.result
    setSales(result.sales)
    setIsCancelSaleLoading(false)
    if (result.sales.length > 0) {
      setSaleToCancel(result.sales[0])
    }
  }

  useEffect(() => {
    getRoyaltyValue()
    getSales()
  }, [])

  const updateRoyaltyValue = async () => {
    if (!userAddress || !blockchainNetworkId) return

    setIsNewRoyaltyValueLoading(true)
    setNewRoyalty(blockchainNetworkId, newRoyaltyValue * 100)
      .then(waitTransaction)
      .then(() => {
        setIsNewRoyaltyValueLoading(false)
      })
      .then(getRoyaltyValue)
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
        setIsNewRoyaltyValueLoading(false)
      })
  }

  const cleanStorage = async () => {
    if (!userAddress || !blockchainNetworkId) return

    setIsCleanStorageLoading(true)
    cleanMarketplaceStorage(blockchainNetworkId)
      .then(waitTransaction)
      .then(() => {
        setIsCleanStorageLoading(false)
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
        setIsCleanStorageLoading(false)
      })
  }

  const onCancelSale = async () => {
    if (!userAddress || !blockchainNetworkId) return
    if (saleToCancel === null) return
    setIsCancelSaleLoading(true)
    cancelSale(
      blockchainNetworkId,
      saleToCancel.contractAddress,
      saleToCancel.tokenId
    )
      .then(waitTransaction)
      .then(() => {
        setIsCancelSaleLoading(false)
      })
      .then(getSales)
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
        setIsCancelSaleLoading(false)
      })
  }

  const withdraw = async () => {
    if (!userAddress || !blockchainNetworkId) return

    setIsWithdrawLoading(true)
    withdrawOwner(blockchainNetworkId)
      .then(waitTransaction)
      .then(() => {
        getRoyaltyValue()
        setIsWithdrawLoading(false)
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
        setIsWithdrawLoading(false)
      })
  }

  const withdrawToAll = async (address: string) => {
    if (!userAddress || !blockchainNetworkId) return

    setIsWithdrawToLoading(true)
    withdrawTo(blockchainNetworkId, address)
      .then(waitTransaction)
      .then(() => {
        getRoyaltyValue()
        setIsWithdrawToLoading(false)
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
        setIsWithdrawToLoading(false)
      })
  }

  const withdrawToAmount = async (address: string, amount: number) => {
    if (!userAddress || !blockchainNetworkId) return

    setIsWithdrawToAmountLoading(true)
    withdrawToAmountService(blockchainNetworkId, address, amount)
      .then(waitTransaction)
      .then(() => {
        getRoyaltyValue()
        setIsWithdrawToAmountLoading(false)
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
        setIsWithdrawToAmountLoading(false)
      })
  }

  return {
    royaltyValue,
    marketplaceBalance,
    newRoyaltyValue,
    setNewRoyaltyValue,
    isNewRoyaltyValueLoading,
    updateRoyaltyValue,
    cleanStorage,
    isCleanStorageLoading,
    sales,
    saleToCancel,
    isCancelSaleLoading,
    onCancelSale,
    withdraw,
    isWithdrawLoading,
    withdrawToAll,
    isWithdrawToLoading,
    withdrawToAmount,
    isWithdrawToAmountLoading,
    setSaleToCancel,
  }
}
