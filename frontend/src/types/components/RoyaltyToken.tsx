import { Royalty } from './Royalty'

export type RoyaltyToken = {
  royalties: Royalty[]
  royaltySum: number
  supportsErc2981: boolean
  supportsErc2981MultiReceiver: boolean
  isCollectionDefault: boolean
  hasPaymentSplitter: boolean
}
