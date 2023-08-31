import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../../context/userContext'
import useFetching from '../../../hooks/useFetching'
import {
  handlerQueryErrorCatch,
  ownedNftsQuery,
} from '../../../services/BackendService'
import { NFT } from '../../../types/components/NFT'

export default function useMyNFTs() {
  const navigate = useNavigate()
  const { userAddress, blockchainNetworkId } = useUserContext()
  const [ownedNfts, setOwnedNfts] = useState<NFT[]>([])
  const { isFetching, setIsFetching, isError, setIsError } = useFetching()

  useEffect(() => {
    const fetchOwnedNfts = async () => {
      if (!userAddress || !blockchainNetworkId) return

      setIsFetching(true)
      const response = await handlerQueryErrorCatch(
        ownedNftsQuery(blockchainNetworkId, userAddress)
      )

      if (response.error) {
        setIsError(true)
        setIsFetching(false)
        return
      }

      const result = response.result

      const ownedNfts = result.ownedNfts as NFT[]
      setOwnedNfts(ownedNfts)
      setIsFetching(false)
    }

    fetchOwnedNfts()
  }, [userAddress])

  const onNavigateToObservedCollections = () => {
    navigate('/account/dashboard/observed-collections')
  }

  return { ownedNfts, isFetching, isError, onNavigateToObservedCollections }
}
