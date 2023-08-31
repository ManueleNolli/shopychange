import { useCallback, useEffect, useState } from 'react'
import { Placeholder } from '../../assets/AssetsManager'
import { useUserContext } from '../../context/userContext'
import useFetching from '../../hooks/useFetching'
import { Sale } from '../../types/components/Sale'
import { NFTCardProps } from '../../types/props/NFTCardProps'
import {
  handlerQueryErrorCatch,
  saleQuery,
} from '../../services/BackendService'
import CheckImageSrc from '../../utils/CheckImageSrc/CheckImageSrc'

export default function useNFTCard({ nft, saleButton }: NFTCardProps) {
  const { userAddress, blockchainNetworkId } = useUserContext()
  const { isFetching, setIsFetching, isError, setIsError } = useFetching()

  const [image, setImage] = useState<string>(Placeholder)
  const [sale, setSale] = useState<Sale | null>(null)

  const fetchSale = async () => {
    if (!userAddress || !blockchainNetworkId) return

    const response = await handlerQueryErrorCatch(
      saleQuery(blockchainNetworkId, nft.contractAddress, nft.tokenId)
    )

    if (response.error) {
      setIsError(true)
      setIsFetching(false)
      return
    }

    const sale = response.result.sale as Sale
    setSale(sale)
  }

  const updateSale = useCallback(async () => {
    fetchSale()
  }, [])

  useEffect(() => {
    const fetchImage = async () => {
      const exists = await CheckImageSrc(nft.image)
      if (exists) setImage(nft.image)
    }

    fetchImage()

    if (saleButton) fetchSale().then(() => setIsFetching(false))
  }, [])

  return {
    isFetching,
    isError,
    image,
    sale,
    updateSale,
  }
}
