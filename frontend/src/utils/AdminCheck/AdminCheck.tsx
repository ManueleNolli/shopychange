import React, { useEffect, useState } from 'react'
import {
  handlerQueryErrorCatch,
  isAdminQuery,
} from '../../services/BackendService'
import { useNavigate } from 'react-router-dom'
import { AdminCheckProps } from '../../types/props/AdminCheckProps'
import { useUserContext } from '../../context/userContext'
import useFetching from '../../hooks/useFetching'

export default function AdminCheck({
  children,
  redirectHome = true,
}: AdminCheckProps) {
  const { userAddress, blockchainNetworkId } = useUserContext()

  const navigate = useNavigate()
  const { isFetching, setIsFetching, setIsError } = useFetching()
  const [isAdmin, setIsAdmin] = useState(false)

  const fetchIsAdmin = async () => {
    if (!userAddress || !blockchainNetworkId) return

    const response = await handlerQueryErrorCatch(
      isAdminQuery(blockchainNetworkId, userAddress)
    )

    if (response.error) {
      setIsError(true)
      setIsFetching(false)
      return
    }

    const result = response.result

    setIsAdmin(result.isAdmin)
    setIsFetching(false)
  }

  useEffect(() => {
    fetchIsAdmin()
  }, [userAddress])

  useEffect(() => {
    if (!isFetching && !isAdmin && redirectHome) {
      navigate('/')
    }
  }, [fetchIsAdmin, isAdmin])

  if (!isFetching && !isAdmin && !redirectHome) {
    return null
  }

  if (!isFetching && isAdmin) {
    return <>{children}</>
  }
  return null
}
