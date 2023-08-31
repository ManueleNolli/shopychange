import React from 'react'
import { useParams } from 'react-router-dom'
import Error from '../pages/Error/Error'
import { checksumAddress } from '../utils/ChecksumAddress/ChecksumAddress'
import CollectionOwnerCheck from '../utils/CollectionOwnerCheck/CollectionOwnerCheck'
import NFTRoyalties from '../pages/NFTRoyalties/NFTRoyalties'

export default function NFTRoyaltiesRouter() {
  const { contractAddress, tokenId } = useParams<{
    contractAddress: string
    tokenId: string
  }>()

  if (
    !contractAddress ||
    !tokenId ||
    !contractAddress.match(/^0x[a-fA-F0-9]{40}$/)
  ) {
    return <Error />
  }

  const checksummedContractAddress = checksumAddress(contractAddress)

  const numTokenId = parseInt(tokenId)
  if (isNaN(numTokenId)) {
    return <Error />
  }

  return (
    <CollectionOwnerCheck collectionAddress={checksummedContractAddress}>
      <NFTRoyalties address={checksummedContractAddress} tokenId={numTokenId} />
    </CollectionOwnerCheck>
  )
}
