import { useState, useCallback, useEffect } from 'react'
import { Placeholder } from '../../assets/AssetsManager'
import { useUserContext } from '../../context/userContext'
import {
  nftCompleteQuery,
  saleQuery,
  nftHistoryQuery,
  handlerQueryErrorCatch,
} from '../../services/BackendService'
import { NFTHistory } from '../../types/components/Events'
import { NFTComplete } from '../../types/components/NFTComplete'
import { Sale } from '../../types/components/Sale'
import CheckImageSrc from '../../utils/CheckImageSrc/CheckImageSrc'
import { NFTPageProps } from '../../types/props/NFTPageProps'
import useFetching from '../../hooks/useFetching'

export default function useNFTPage({ contractAddress, tokenId }: NFTPageProps) {
  const { userAddress, blockchainNetworkId } = useUserContext()

  const [image, setImage] = useState<string>(Placeholder)

  const [nftComplete, setNftComplete] = useState<NFTComplete>({
    nft: {
      name: '',
      image: '',
      contractAddress: '',
      tokenId: 0,
    },
    owner: '',
    description: '',
    attributes: [],
    contract: {
      name: '',
      symbol: '',
      address: '',
    },
    tokenType: '',
  })
  const {
    isFetching: isNftCompleteFetching,
    setIsFetching: setIsNftCompleteFetching,
    isError: isNftCompleteError,
    setIsError: setIsNftCompleteError,
  } = useFetching()

  const [sale, setSale] = useState<Sale | null>(null)
  const {
    isFetching: isSaleFetching,
    setIsFetching: setIsSaleFetching,
    isError: isSaleError,
    setIsError: setIsSaleError,
  } = useFetching()

  const [history, setHistory] = useState<NFTHistory>(
    [] as unknown as NFTHistory
  )
  const {
    isFetching: isHistoryFetching,
    setIsFetching: setIsHistoryFetching,
    isError: isHistoryError,
    setIsError: setIsHistoryError,
  } = useFetching()

  const fetchNFTComplete = async () => {
    if (!userAddress || !blockchainNetworkId) return

    const response = await handlerQueryErrorCatch(
      nftCompleteQuery(blockchainNetworkId, contractAddress, tokenId)
    )

    if (response.error) {
      setIsNftCompleteError(true)
      setIsNftCompleteFetching(false)
      return
    }

    const result = response.result
    const nftComplete = result.nftComplete as NFTComplete
    setNftComplete(nftComplete)
    setIsNftCompleteFetching(false)
    return nftComplete
  }

  const fetchSale = async () => {
    if (!userAddress || !blockchainNetworkId) return

    const response = await handlerQueryErrorCatch(
      saleQuery(blockchainNetworkId, contractAddress, tokenId)
    )

    if (response.error) {
      setIsSaleError(true)
      setIsSaleFetching(false)
      return
    }

    const result = response.result

    const sale = result.sale as Sale
    setSale(sale)
    setIsSaleFetching(false)
  }

  const fetchHistory = async () => {
    if (!userAddress || !blockchainNetworkId) return

    const response = await handlerQueryErrorCatch(
      nftHistoryQuery(blockchainNetworkId, contractAddress, tokenId)
    )

    if (response.error) {
      setIsHistoryError(true)
      setIsHistoryFetching(false)
      return
    }

    const result = response.result
    const history = result.nftHistory as NFTHistory
    setHistory(history)
    setIsHistoryFetching(false)
  }

  const updateAll = useCallback(async () => {
    fetchSale()
    fetchHistory()
    fetchNFTComplete()
  }, [contractAddress, tokenId])

  useEffect(() => {
    const fetchImage = async (nftCompleteFetched: NFTComplete | undefined) => {
      if (nftCompleteFetched === undefined) return
      const exists = await CheckImageSrc(nftCompleteFetched.nft.image)
      if (exists) setImage(nftCompleteFetched.nft.image)
    }
    fetchNFTComplete().then(fetchImage)
    fetchSale()
    fetchHistory()
  }, [])

  return {
    image,
    nftComplete,
    isNftCompleteFetching,
    isNftCompleteError,
    sale,
    isSaleFetching,
    isSaleError,
    history,
    isHistoryFetching,
    isHistoryError,
    updateAll,
  }
}
