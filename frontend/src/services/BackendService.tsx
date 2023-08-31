import { gql, DocumentNode } from '@apollo/client'
import { client } from '../App'
/***********
 * Queries *
 **********/
export const ownedNftsQuery = (chainId: number, address: string) => {
  return gql`
    query {
      ownedNfts(chainId: ${chainId}, address: "${address}") {
        contractAddress
        tokenId
        image
        name
      }
    }
`
}

export const nftCompleteQuery = (
  chainId: number,
  address: string,
  tokenId: number
) => {
  return gql`
  query {
    nftComplete(chainId: ${chainId}, address: "${address}", tokenId: ${tokenId}){
      nft {
        contractAddress
        tokenId
        image
        name
      }
      contract {
        name
        symbol
        address
      }
      attributes {
        traitType
        value
      }
      owner
      description
      tokenType
    }
  }
`
}

export const salesQuery = (chainId: number) => {
  return gql`
    query {
      sales(chainId: ${chainId}) {
        contractAddress
        tokenId
        image
        name
      }
    }
  `
}

export const saleQuery = (
  chainId: number,
  address: string,
  tokenId: number
) => {
  return gql`
  query {
    sale(chainId: ${chainId}, address: "${address}", tokenId: ${tokenId}) {
      nft {
        contractAddress
        tokenId
        image
        name
      }
      seller
      price
      status
    }
  }
`
}

export const isMarketplaceApprovedQuery = (
  chainId: number,
  address: string,
  tokenId: number
) => {
  return gql`
  query {
    isMarketplaceApproved(
      chainId: ${chainId}, address: "${address}", tokenId: ${tokenId}
    )
  }
`
}

export const isTokenForSaleQuery = (
  chainId: number,
  address: string,
  tokenId: number
) => {
  return gql`
  query {
    isTokenForSale(
      chainId: ${chainId}, address: "${address}", tokenId: ${tokenId}
    )
  }
`
}

export const ownedERC721ContractQuery = (chainId: number, address: string) => {
  return gql`
  query{
    contractOwnedCreatedWithShopychange(chainId: ${chainId}, address:"${address}"){
      address
      name
      symbol
    }
  }
`
}

export const collectionQuery = (chainId: number, address: string) => {
  return gql`
  query {
    collection(chainId: ${chainId}, address: "${address}"){
      contract {
        name
        symbol
        address
      }
      nfts {
        name
        tokenId
        image
        contractAddress
      }
    }
  }
`
}

export const contractQuery = (chainId: number, address: string) => {
  return gql`
  query {
    contract(chainId: ${chainId}, address: "${address}") {
      name
      symbol
      address
    }
  }
`
}

export const nftHistoryQuery = (
  chainId: number,
  address: string,
  tokenId: number
) => {
  return gql`
  query nftHistory {
    nftHistory(chainId: ${chainId}, address: "${address}"
    tokenId: ${tokenId}) {
      __typename
      ... on EventTransfer {
        date
        fromAddress
        toAddress
      } 
      ... on EventApproval {
        date
        owner
        approved   
      } 
      ... on EventApprovalForAll {
        date
        owner
        isApproved  
        operator
      } 
      ... on EventMint {
        date
        toAddress
      } 
      ... on EventBurn {
        date
        fromAddress
      } 
      ... on EventSaleCreated {
        date
        seller
        price
      }
      ... on EventSaleBought {
        date
        seller
        buyer
        price
      }
      ... on EventSaleCancelled {
        date
        seller
      }
      ... on EventSalePriceModified {
        date
        seller
        previousPrice
        price
      }
    }
  }
  `
}

export const isAdminQuery = (chainId: number, address: string) => {
  return gql`
  query {
    isAdmin(chainId: ${chainId}, address:"${address}")
  }
`
}

export const marketplaceRoyaltyQuery = (chainId: number) => {
  return gql`
    query {
      marketplaceRoyalty(chainId: ${chainId})
    }
  `
}

export const AdminQuery = (chainId: number) => {
  return gql`
    query {
      marketplaceRoyalty(chainId: ${chainId})
      marketplaceBalance(chainId: ${chainId})
    }
  `
}

export const collectionOwnerQuery = (chainId: number, address: string) => {
  return gql`
    query {
      collectionOwner(chainId: ${chainId}, address: "${address}")
    }
  `
}

export const collectionRoyaltiesQuery = (chainId: number, address: string) => {
  return gql`
  query {
    withdrawRoyaltyCollection(chainId: ${chainId}, address: "${address}"){
      receivers {
        receiver
        amount
      }
      paymentSplitterAddress
    }
  }
  `
}

export const tokenRoyaltiesQuery = (
  chainId: number,
  address: string,
  tokenId: number
) => {
  return gql`
  query {
    withdrawRoyaltyToken(chainId: ${chainId}, address: "${address}"
    tokenId: ${tokenId}){
      receivers {
        receiver
        amount
      }
      paymentSplitterAddress
    }
  }
  `
}

export const royaltyQuery = (
  chainId: number,
  address: string,
  tokenId: number
) => {
  return gql`
  query {
    marketplaceRoyalty(chainId: ${chainId})
  	royaltyToken(chainId: ${chainId}, address: "${address}"
    tokenId: ${tokenId}){
    supportsErc2981MultiReceiver
    supportsErc2981
    royalties{
      receiver
      share
    }
    royaltySum
  	}
  }
`
}

export const collectionRoyaltyQuery = (chainId: number, address: string) => {
  return gql`
  query {
    contract(chainId: ${chainId}, address: "${address}") {
      name
      symbol
      address
    }
  royaltyCollection(chainId: ${chainId}, address:"${address}"){
    supportsErc2981MultiReceiver
    supportsErc2981
    royalties{
      receiver
      share
    }
    royaltySum
    hasPaymentSplitter
  	}
  }
`
}

export const NFTRoyaltyQuery = (
  chainId: number,
  address: string,
  tokenId: number
) => {
  return gql`
  query {
    nftComplete(chainId: ${chainId}, address: "${address}"
    tokenId: ${tokenId}){
      nft {
        contractAddress
        tokenId
        image
        name
      }
    }
  royaltyToken(chainId: ${chainId}, address:"${address}" tokenId: ${tokenId}){
    supportsErc2981MultiReceiver
    supportsErc2981
    royalties{
      receiver
      share
    }
    royaltySum
    isCollectionDefault
    hasPaymentSplitter
  	}
  }
`
}

export const contractObservedQuery = (address: string) => {
  return gql`
  query {
    contractObserved(address:"${address}") 
  }
`
}

export const AddNFTCollectionsMutation = (
  addresses: string[],
  userAddress: string
) => {
  return gql`
    mutation {
      addNftCollections(
        addresses: [
          ${addresses.map((address) => `"${address}"`).join(',')}
        ]
        userAddress: "${userAddress}"
      ) {
        nftCollections {
          collectionAddress
          users {
            walletAddress
          }
        }
      }
    }
  `
}

export const RemoveNFTCollectionsMutation = (
  addresses: string[],
  userAddress: string
) => {
  return gql`
    mutation {
      removeNftCollections(
        addresses: [
          ${addresses.map((address) => `"${address}"`).join(',')}
        ]
        userAddress: "${userAddress}"
      ) {
        nftCollections {
          collectionAddress
          users {
            walletAddress
          }
        }
      }
    }
  `
}

/***********
 * Handler *
 **********/

export const handlerQueryErrorCatch = async (query: DocumentNode) => {
  try {
    const result = await client.query({
      query: query,
    })
    return { result: result.data, error: false }
  } catch (error) {
    return { result: null, error: true }
  }
}

export const handlerMutation = async (mutation: DocumentNode) => {
  try {
    const result = await client.mutate({
      mutation: mutation,
    })

    return { result: result.data, error: false }
  } catch (error) {
    return { result: null, error: true }
  }
}
