import { useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../../context/userContext'
import {
  ownedERC721ContractQuery,
  handlerMutation,
  AddNFTCollectionsMutation,
  handlerQueryErrorCatch,
} from '../../../services/BackendService'
import {
  storageAddress,
  mintNewSingleToken,
  waitTransaction,
} from '../../../services/BlockchainService'
import { uploadNFT } from '../../../services/IPFSService'
import { MintResult } from '../../../types/api/MintResult'
import {
  Contract,
  OwnedERC721ContractsResponse,
} from '../../../types/api/OwnedERC721Contracts'
import { FormValues } from './CreateSingleToken'

export default function useCreateSingleToken() {
  const navigate = useNavigate()
  const toast = useToast()
  const { userAddress, blockchainNetworkId } = useUserContext()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [contracts, setContracts] = useState<Contract[]>([])

  useEffect(() => {
    if (!userAddress || !blockchainNetworkId) return

    const storageAddr = storageAddress(blockchainNetworkId)
    if (!storageAddr) return

    const fetchERC721OwnedContract = async () => {
      const response = await handlerQueryErrorCatch(
        ownedERC721ContractQuery(blockchainNetworkId, userAddress)
      )

      const shopychangeContract = {
        address: storageAddr,
        name: 'Shopychange Storage',
        symbol: 'SCS',
      }

      if (response.error) {
        setIsLoading(false)
        setContracts(() => [shopychangeContract])
        return
      }

      const result = response.result as OwnedERC721ContractsResponse

      const gettedContracts =
        result.contractOwnedCreatedWithShopychange as unknown as Contract[]

      setContracts(() => [shopychangeContract, ...gettedContracts])
      setIsLoading(false)
    }

    fetchERC721OwnedContract()
  }, [userAddress, blockchainNetworkId])

  const onNavigation = (address: string, tokenId: number) => {
    navigate(`/${address}/${tokenId}`)
  }

  const handleSubmit = async (values: FormValues) => {
    if (!userAddress || !blockchainNetworkId) return

    // delete attributes with empty values
    values.attributes = values.attributes.filter(
      (attribute) => attribute.value !== '' && attribute.trait_type !== ''
    )
    setIsLoading(true)
    uploadNFT({
      name: values.name,
      description: values.description,
      image: values.image,
      attributes: values.attributes,
    })
      .then((url) => {
        mintNewSingleToken(
          blockchainNetworkId,
          values.contractAddress,
          url,
          userAddress,
          values.royalties
        )
          .then((value: MintResult) => {
            waitTransaction(value.writeContractResult)
              .then(() => {
                handlerMutation(
                  AddNFTCollectionsMutation(
                    [values.contractAddress],
                    userAddress
                  )
                )
              })
              .then(() => {
                setIsLoading(false)
                onNavigation(values.contractAddress, value.resultValue)
              })
          })
          .catch((err) => {
            // First phrase of the error message is enough
            const errorMessage = err.message.split('.')[0]
            toast({
              variant: 'solid',
              title: 'Transaction failed',
              description: errorMessage,
              status: 'warning',
              duration: 9000,
              isClosable: true,
            })
            setIsLoading(false)
          })
      }) // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((err: any) => {
        // First phrase of the error message is enough
        const errorMessage = err.message.split('.')[0]
        toast({
          variant: 'solid',
          title: 'Transaction failed',
          description: errorMessage,
          status: 'warning',
          duration: 9000,
          isClosable: true,
        })
        setIsLoading(false)
      })
  }

  return {
    isLoading,
    contracts,
    handleSubmit,
  }
}
