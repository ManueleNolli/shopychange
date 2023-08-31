import React from 'react'
import { useParams } from 'react-router-dom'
import Error from '../pages/Error/Error'
import { checksumAddress } from '../utils/ChecksumAddress/ChecksumAddress'
import CollectionPage from '../pages/CollectionPage/CollectionPage'

export default function CollectionPageRouter() {
  const { contractAddress } = useParams<{
    contractAddress: string
  }>()

  if (!contractAddress || !contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
    return <Error />
  }

  const checksummedContractAddress = checksumAddress(contractAddress)

  return <CollectionPage contractAddress={checksummedContractAddress} />
}
