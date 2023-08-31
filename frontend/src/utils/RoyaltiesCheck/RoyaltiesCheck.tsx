import React, { useEffect, useState } from 'react'
import {
  collectionRoyaltiesQuery,
  tokenRoyaltiesQuery,
  handlerQueryErrorCatch,
} from '../../services/BackendService'
import { useNavigate } from 'react-router-dom'
import { CollectionRoyaltiesCheckProps } from '../../types/props/RoyaltiesCheckProps'
import { WithdrawReceiver } from '../../types/components/WithdrawReceiver'
import { useUserContext } from '../../context/userContext'
import useFetching from '../../hooks/useFetching'

export default function RoyaltiesCheck({
  children,
  redirectHome = true,
  collectionAddress,
  tokenId,
}: CollectionRoyaltiesCheckProps) {
  const { userAddress, blockchainNetworkId } = useUserContext()

  const navigate = useNavigate()
  const [isReceiver, setIsReceiver] = useState(false)
  const { isFetching, setIsFetching, setIsError } = useFetching()

  const fetchReceivers = async () => {
    if (!userAddress || !blockchainNetworkId) return

    let receivers = []
    if (tokenId) {
      const response = await handlerQueryErrorCatch(
        tokenRoyaltiesQuery(blockchainNetworkId, collectionAddress, tokenId)
      )

      if (response.error) {
        setIsFetching(false)
        setIsError(true)
        return
      }

      const result = response.result
      receivers = result.withdrawRoyaltyToken.receivers
    } else {
      const response = await handlerQueryErrorCatch(
        collectionRoyaltiesQuery(blockchainNetworkId, collectionAddress)
      )

      if (response.error) {
        setIsFetching(false)
        setIsError(true)
        return
      }

      const result = response.result

      receivers = result.withdrawRoyaltyCollection.receivers
    }

    const presence = receivers.find((receiver: WithdrawReceiver) => {
      return receiver.receiver === userAddress
    })
    if (presence) {
      setIsReceiver(true)
    }
    setIsFetching(false)
  }

  useEffect(() => {
    fetchReceivers()
  }, [userAddress])

  useEffect(() => {
    if (!isFetching && !isReceiver && redirectHome) {
      navigate('/')
    }
  }, [isFetching, fetchReceivers])

  if (!isFetching && !isReceiver && !redirectHome) {
    return null
  }

  if (!isFetching && isReceiver) {
    return <>{children}</>
  }
  return null
}
