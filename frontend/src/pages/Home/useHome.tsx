import { useEffect, useState } from 'react'
import {
  handlerQueryErrorCatch,
  salesQuery,
} from '../../services/BackendService'
import { useUserContext } from '../../context/userContext'
import { NFT } from '../../types/components/NFT'
import useFetching from '../../hooks/useFetching'

export default function useHome() {
  const { blockchainNetworkId, userAddress } = useUserContext()
  const [sales, setSales] = useState<NFT[]>([])
  const { isFetching, isError, setIsFetching, setIsError } = useFetching()

  useEffect(() => {
    const fetchSales = async () => {
      if (!blockchainNetworkId) return

      const response = await handlerQueryErrorCatch(
        salesQuery(blockchainNetworkId)
      )

      if (response.error) {
        setIsError(true)
        setIsFetching(false)
        return
      }

      const sales = response.result.sales as NFT[]
      setSales(sales)
      setIsFetching(false)
    }

    fetchSales()
  }, [blockchainNetworkId])

  return { sales, isFetching, isError, isConnected: userAddress !== null }
}
