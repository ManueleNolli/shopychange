export type Contract = {
  address: string
  name: string
  symbol: string
}

export type OwnedERC721Contracts = {
  ownedERC721Contracts: Contract[]
}

export type OwnedERC721ContractsResponse = {
  contractOwnedCreatedWithShopychange: OwnedERC721Contracts
}
