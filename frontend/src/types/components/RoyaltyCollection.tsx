import { Royalty } from './Royalty'

export type RoyaltyCollection = {
  royalties: Royalty[]
  royaltySum: number
  supportsErc2981: boolean
  supportsErc2981MultiReceiver: boolean
  hasPaymentSplitter: boolean
}
