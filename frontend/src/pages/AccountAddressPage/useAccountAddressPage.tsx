import { useEffect, useState } from 'react'
import { useUserContext } from '../../context/userContext'
import useFetching from '../../hooks/useFetching'
import { NFT } from '../../types/components/NFT'
import {
  handlerQueryErrorCatch,
  ownedNftsQuery,
} from '../../services/BackendService'

export default function useAccountAddressPage(address: string) {
  const { blockchainNetworkId } = useUserContext()
  const { isFetching, setIsFetching, isError, setIsError } = useFetching()
  const [nfts, setNfts] = useState<NFT[]>([])

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!blockchainNetworkId) return

      const response = await handlerQueryErrorCatch(
        ownedNftsQuery(blockchainNetworkId, address)
      )

      if (response.error) {
        setIsError(true)
        setIsFetching(false)
        return
      }

      const nfts = response.result.ownedNfts as NFT[]
      setNfts(nfts)
      setIsFetching(false)
    }

    fetchNFTs()
  })

  return {
    isFetching,
    isError,
    nfts,
  }
}
