import { useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../../context/userContext'
import {
  handlerMutation,
  AddNFTCollectionsMutation,
} from '../../../services/BackendService'
import {
  createNewERC721Contract,
  waitTransaction,
} from '../../../services/BlockchainService'
import { uploadCollection } from '../../../services/IPFSService'
import { CreateNewCollection } from '../../../types/api/CreateNewCollection'
import { FormValues } from './CreateCollection'

export default function useCreateCollection() {
  const toast = useToast()
  const navigate = useNavigate()
  const { userAddress, blockchainNetworkId } = useUserContext()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: FormValues) => {
    if (!userAddress || !blockchainNetworkId) return

    // delete attributes with empty values
    values.nfts.forEach((nft) => {
      nft.attributes = nft.attributes.filter(
        (attribute) => attribute.value !== '' && attribute.trait_type !== ''
      )
    })

    // replate {id} with index in name and description
    values.nfts.forEach((nft, index) => {
      nft.name = nft.name.replace('{id}', index.toString())
      nft.description = nft.description.replace('{id}', index.toString())
    })

    setIsLoading(true)
    if (values.nfts.length === 0) {
      toast({
        variant: 'solid',
        title: 'Transaction failed',
        description: 'You must add at least one NFT',
        status: 'warning',
        duration: 9000,
        isClosable: true,
      })
      setIsLoading(false)
      return
    }

    uploadCollection(values.nfts)
      .then((cid) => {
        createNewERC721Contract(
          blockchainNetworkId,
          values.name,
          values.symbol,
          `ipfs://${cid}/`,
          values.nfts.length,
          values.royalties
        )
          .then((value: CreateNewCollection) => {
            waitTransaction(value.writeContractResult)
              .then(() => {
                handlerMutation(
                  AddNFTCollectionsMutation([value.resultValue], userAddress)
                )
              })
              .then(() => {
                setIsLoading(false)
                navigate(`/${value.resultValue}`)
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
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        setIsLoading(false)
      })
  }

  return {
    isLoading,
    handleSubmit,
  }
}
