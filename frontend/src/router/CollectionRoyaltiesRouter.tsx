import React from 'react'
import { useParams } from 'react-router-dom'
import Error from '../pages/Error/Error'
import { checksumAddress } from '../utils/ChecksumAddress/ChecksumAddress'
import CollectionOwnerCheck from '../utils/CollectionOwnerCheck/CollectionOwnerCheck'
import CollectionRoyalties from '../pages/CollectionRoyalties/CollectionRoyalties'

export default function CollectionRoyaltiesRouter() {
  const { contractAddress } = useParams<{
    contractAddress: string
  }>()

  if (!contractAddress || !contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
    return <Error />
  }

  const checksummedContractAddress = checksumAddress(contractAddress)

  return (
    <CollectionOwnerCheck collectionAddress={checksummedContractAddress}>
      <CollectionRoyalties address={checksummedContractAddress} />
    </CollectionOwnerCheck>
  )
}
