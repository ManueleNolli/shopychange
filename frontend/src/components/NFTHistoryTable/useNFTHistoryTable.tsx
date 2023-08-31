import { useState, useEffect } from 'react'
import { NFTHistory } from '../../types/components/Events'
import { NFTHistoryTableProps } from '../../types/props/NFTHistoryTableProps'
import { correctDate } from '../../utils/CorrectDate/CorrectDate'

export default function useNFTHistoryTable({
  nftHistory,
}: NFTHistoryTableProps) {
  const [history, setHistory] = useState<NFTHistory>([])

  useEffect(() => {
    // reverse order by timestamp (date like 1689700188) including seconds
    const copy = [...nftHistory]
    const reversedSortedData = copy.sort((a, b) => {
      return correctDate(b.date) - correctDate(a.date)
    })
    setHistory(reversedSortedData)
  }, [nftHistory])

  return {
    history,
  }
}
