import { useEffect, useState } from 'react'
import {
  collectionQuery,
  handlerQueryErrorCatch,
} from '../../services/BackendService'
import useFetching from '../../hooks/useFetching'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../context/userContext'
import { Collection } from '../../types/components/Collection'

export default function useCollectionPage(contractAddress: string) {
  const navigate = useNavigate()
  const { blockchainNetworkId } = useUserContext()
  const { isFetching, setIsFetching, isError, setIsError } = useFetching()
  const [collection, setCollection] = useState<Collection>({
    contract: {
      name: '',
      symbol: '',
      address: '',
    },
    nfts: [],
  })

  useEffect(() => {
    const fetchCollection = async () => {
      if (!blockchainNetworkId) return

      const response = await handlerQueryErrorCatch(
        collectionQuery(blockchainNetworkId, contractAddress)
      )

      if (response.error) {
        setIsError(true)
        setIsFetching(false)
        return
      }

      const collection = response.result.collection as Collection
      setCollection(collection)
      setIsFetching(false)
    }

    fetchCollection()
  })

  const onNavigate = () => {
    navigate(`/${contractAddress}/royalties`)
  }

  return {
    isFetching,
    isError,
    collection,
    onNavigate,
  }
}
