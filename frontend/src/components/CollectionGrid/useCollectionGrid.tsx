import { useEffect, useState } from 'react'

import { Collection } from '../../types/components/Collection'
import { NFT } from '../../types/components/NFT'
import {
  contractQuery,
  handlerQueryErrorCatch,
} from '../../services/BackendService'
import { useUserContext } from '../../context/userContext'
import useFetching from '../../hooks/useFetching'

type useCollectionGridProps = {
  nfts: NFT[]
}

export default function useCollectionGrid({ nfts }: useCollectionGridProps) {
  const { userAddress, blockchainNetworkId } = useUserContext()
  const { isFetching, setIsFetching, isError, setIsError } = useFetching()
  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    // Group nfts by contract address
    const groupedNfts = nfts.reduce((acc: { [key: string]: NFT[] }, nft) => {
      const contractAddress = nft.contractAddress

      if (!acc[contractAddress]) {
        acc[contractAddress] = []
      }

      acc[contractAddress].push(nft)
      return acc
    }, {})

    // Get contract metadata for each contract address
    const contractAddresses = Object.keys(groupedNfts)

    const fetchContractMetadata = async (contractAddress: string) => {
      if (!userAddress || !blockchainNetworkId) return

      const response = await handlerQueryErrorCatch(
        contractQuery(blockchainNetworkId, contractAddress)
      )
      if (response.error) {
        setIsError(true)
        setIsFetching(false)
        return
      }

      const contract = response.result.contract
      return contract
    }

    const fetchContractsMetadata = async (contractAddresses: string[]) => {
      const contracts = await Promise.all(
        contractAddresses.map(fetchContractMetadata)
      )

      return contracts
    }

    fetchContractsMetadata(contractAddresses).then((contracts) => {
      for (const contract of contracts) {
        if (contract === undefined) {
          setIsError(true)
          setIsFetching(false)
          return
        }
        const nfts = groupedNfts[contract.address]

        const collection: Collection = {
          contract,
          nfts,
        }

        setCollections((collections) => [...collections, collection])
        setIsFetching(false)
      }
    })
  }, [])

  return { isFetching, isError, collections }
}
