import React from 'react'
import { useParams } from 'react-router-dom'
import Error from '../pages/Error/Error'
import { checksumAddress } from '../utils/ChecksumAddress/ChecksumAddress'
import AccountAddressPage from '../pages/AccountAddressPage/AccountAddressPage'

export default function AccountAddressPageRouter() {
  const { address } = useParams<{
    address: string
  }>()
  if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
    return <Error />
  }

  const checksummedaAddress = checksumAddress(address)

  return <AccountAddressPage address={checksummedaAddress} />
}
