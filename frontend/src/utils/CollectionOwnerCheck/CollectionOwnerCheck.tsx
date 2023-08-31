import React, { useEffect, useState } from 'react'
import {
  collectionOwnerQuery,
  handlerQueryErrorCatch,
} from '../../services/BackendService'
import { useNavigate } from 'react-router-dom'
import { CollectionOwnerCheckProps } from '../../types/props/CollectionOwnerCheckProps'
import { useUserContext } from '../../context/userContext'
import useFetching from '../../hooks/useFetching'

export default function CollectionOwnerCheck({
  children,
  redirectHome = true,
  collectionAddress,
}: CollectionOwnerCheckProps) {
  const { userAddress, blockchainNetworkId } = useUserContext()

  const navigate = useNavigate()
  const { isFetching, setIsFetching, setIsError } = useFetching()
  const [isOwner, setIsOwner] = useState(false)

  const fetchIsOwner = async () => {
    if (!userAddress || !blockchainNetworkId) return

    const response = await handlerQueryErrorCatch(
      collectionOwnerQuery(blockchainNetworkId, collectionAddress)
    )

    if (response.error) {
      setIsError(true)
      setIsFetching(false)
      return
    }

    const result = response.result
    setIsOwner(result.collectionOwner === userAddress)
    setIsFetching(false)
  }

  useEffect(() => {
    fetchIsOwner()
  }, [userAddress])

  useEffect(() => {
    if (!isFetching && !isOwner && redirectHome) {
      navigate('/')
    }
  }, [fetchIsOwner, isOwner])

  if (!isFetching && !isOwner && !redirectHome) {
    return null
  }

  if (!isFetching && isOwner) {
    return <>{children}</>
  }
  return null
}
