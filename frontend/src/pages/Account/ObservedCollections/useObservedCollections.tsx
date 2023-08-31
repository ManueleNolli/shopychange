import { useEffect, useState } from 'react'
import {
  AddNFTCollectionsMutation,
  RemoveNFTCollectionsMutation,
  contractObservedQuery,
  handlerMutation,
  handlerQueryErrorCatch,
} from '../../../services/BackendService'
import useFetching from '../../../hooks/useFetching'
import { useUserContext } from '../../../context/userContext'

export default function useObservedCollections() {
  const { userAddress } = useUserContext()
  const {
    isFetching: isObservedFetching,
    setIsFetching: setIsObservedFetching,
    isError: isObservedError,
    setIsError: setIsObservedError,
  } = useFetching()
  const [observedCollections, setObservedCollections] = useState<string[]>([])

  const fetchObservedCollections = async () => {
    if (!userAddress) return

    const response = await handlerQueryErrorCatch(
      contractObservedQuery(userAddress)
    )

    if (response.error) {
      setIsObservedError(true)
      setIsObservedFetching(false)
      return
    }

    const observedCollections = response.result.contractObserved
    setObservedCollections(observedCollections)
    setIsObservedFetching(false)
  }

  useEffect(() => {
    fetchObservedCollections()
  }, [])

  const handleSubmit = async (values: { observedCollections: string[] }) => {
    if (!userAddress) return

    const addedCollections = values.observedCollections.filter(
      (collection) => !observedCollections.includes(collection)
    )

    if (addedCollections.length > 0) {
      const responseAdd = await handlerMutation(
        AddNFTCollectionsMutation(addedCollections, userAddress)
      )

      if (responseAdd.error) {
        setIsObservedError(true)
        return
      }
    }

    const removedCollections = observedCollections.filter(
      (collection) => !values.observedCollections.includes(collection)
    )

    if (removedCollections.length > 0) {
      const responseRemove = await handlerMutation(
        RemoveNFTCollectionsMutation(removedCollections, userAddress)
      )

      if (responseRemove.error) {
        setIsObservedError(true)
        return
      }
    }

    fetchObservedCollections()
  }

  return {
    observedCollections,
    isObservedFetching,
    isObservedError,
    handleSubmit,
  }
}
