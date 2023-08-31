export enum EventType {
  Mint = 'EventMint',
  Burn = 'EventBurn',
  Transfer = 'EventTransfer',
  Approval = 'EventApproval',
  ApprovalForAll = 'EventApprovalForAll',
  SaleCreated = 'EventSaleCreated',
  SalePriceModified = 'EventSalePriceModified',
  SaleCancelled = 'EventSaleCancelled',
  SaleBought = 'EventSaleBought',
}

export interface EventGeneric {
  date: string
  __typename: EventType
}

export interface EventTransfer extends EventGeneric {
  fromAddress: string
  toAddress: string
}

export interface EventApproval extends EventGeneric {
  owner: string
  approved: string
}

export interface EventApprovalForAll extends EventGeneric {
  owner: string
  operator: string
  isApproved: boolean
}

export interface EventMint extends EventGeneric {
  toAddress: string
}

export interface EventBurn extends EventGeneric {
  fromAddress: string
}

export interface EventSaleCreated extends EventGeneric {
  seller: string
  price: number
}

export interface EventSalePriceModified extends EventGeneric {
  seller: string
  previousPrice: number
  price: number
}

export interface EventSaleCancelled extends EventGeneric {
  seller: string
}

export interface EventSaleBought extends EventGeneric {
  seller: string
  buyer: string
  price: number
}

export type EventNFT =
  | EventTransfer
  | EventApproval
  | EventApprovalForAll
  | EventMint
  | EventBurn
  | EventSaleCreated
  | EventSalePriceModified
  | EventSaleCancelled
  | EventSaleBought

export type NFTHistory = EventNFT[]
