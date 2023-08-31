import { useState, useEffect } from 'react'
import { useUserContext } from '../../context/userContext'
import {
  handlerQueryErrorCatch,
  royaltyQuery,
} from '../../services/BackendService'
import { PriceDistributionProps } from '../../types/components/PriceDistribution'
import { Royalty } from '../../types/components/Royalty'
import useFetching from '../../hooks/useFetching'

export default function usePriceDistrubution({
  address,
  tokenId,
  price,
}: PriceDistributionProps) {
  const { userAddress, blockchainNetworkId } = useUserContext()

  const [settedPrice, setSettedPrice] = useState<number>(price)
  const [remainingValue, setRemainingValue] = useState<number>(0)
  const [marketplaceRoyalty, setMarketplaceRoyalty] = useState<number>(0)
  const [otherRoyalties, setOtherRoyalties] = useState<Royalty[]>([])
  const [otherRoyaltiesSum, setOtherRoyaltiesSum] = useState<number>(0)
  const { isFetching, setIsFetching, isError, setIsError } = useFetching()

  const getRoyaltyValue = async () => {
    if (!userAddress || !blockchainNetworkId) return

    const response = await handlerQueryErrorCatch(
      royaltyQuery(blockchainNetworkId, address, tokenId)
    )

    if (response.error) {
      setIsError(true)
      setIsFetching(false)
      return
    }

    const data = response.result

    setMarketplaceRoyalty(data.marketplaceRoyalty)
    setOtherRoyalties(data.royaltyToken.royalties)
    setOtherRoyaltiesSum(data.royaltyToken.royaltySum)
    setIsFetching(false)
  }

  const fixedNumber = (value: number) => {
    return Number(value.toFixed(4))
  }

  useEffect(() => {
    getRoyaltyValue()
  }, [])

  useEffect(() => {
    setSettedPrice(!Number.isNaN(price) ? price : 0)
    setRemainingValue(
      !Number.isNaN(price) ? price - (price * marketplaceRoyalty) / 100 : 0
    )
  }, [price])

  return {
    settedPrice,
    remainingValue,
    otherRoyalties,
    otherRoyaltiesSum,
    marketplaceRoyalty,
    fixedNumber,
    isFetching,
    isError,
  }
}
