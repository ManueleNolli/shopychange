import { useState } from 'react'

export default function useNFTOrCollectionViewer() {
  const [nftsView, setNftsView] = useState(true) // true = NFTs, false = Collections

  return {
    nftsView,
    setNftsView,
  }
}
