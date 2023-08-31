import React from 'react'
import { useParams } from 'react-router-dom'
import NFTPage from '../pages/NFTPage/NFTPage'
import Error from '../pages/Error/Error'
import { checksumAddress } from '../utils/ChecksumAddress/ChecksumAddress'

export default function NFTPageRouter() {
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
    <NFTPage
      contractAddress={checksummedContractAddress}
      tokenId={numTokenId}
    />
  )
}
