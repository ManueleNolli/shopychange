import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from '@wagmi/core'
import { WaitForTransactionReceiptParameters, parseEther } from 'viem'

import marketplaceContract from '../contracts/ShopychangeMarketplace.json'
import storageContract from '../contracts/ShopychangeStorage.json'
import boilerplateContract from '../contracts/BoilerplateERC721.json'
import factoryERC721Contract from '../contracts/ShopychangeERC721Factory.json'
import erc2981MultiReceiverContract from '../contracts/ERC2981MultiReceiver.json'
import paymentSplitter from '../contracts/ShopychangePaymentSplitter.json'

import { MintResult } from '../types/api/MintResult'
import { CreateNewCollection } from '../types/api/CreateNewCollection'
import { Royalty } from '../types/components/Royalty'
import { erc721ABI } from 'wagmi'

export async function askApproval(
  chainId: number,
  contract: string,
  tokenId: number
) {
  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: contract,
    abi: erc721ABI,
    functionName: 'approve',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    args: [marketplaceAddress(chainId), tokenId],
  })

  return await writeContract(request)
}

export async function createSale(
  chainId: number,
  contract: string,
  tokenId: number,
  price: number
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const priceCorrectFormat = parseEther(price.toString())

  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: marketplaceAddress(chainId),
    abi: marketplaceContract.abi,
    functionName: 'createSale',
    args: [contract, tokenId, priceCorrectFormat],
  })

  return await writeContract(request)
}

export async function waitTransaction(
  hash: WaitForTransactionReceiptParameters
) {
  await waitForTransaction(hash)
}

export async function buy(
  chainId: number,
  contract: string,
  tokenId: number,
  price: number
) {
  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: marketplaceAddress(chainId),
    abi: marketplaceContract.abi,
    functionName: 'buy',
    args: [contract, tokenId],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    value: parseEther(price.toString()),
  })

  return await writeContract(request)
}

export async function cancelSale(
  chainId: number,
  contract: string,
  tokenId: number
) {
  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: marketplaceAddress(chainId),
    abi: marketplaceContract.abi,
    functionName: 'cancelSale',
    args: [contract, tokenId],
  })

  return await writeContract(request)
}

export async function modifySale(
  chainId: number,
  contract: string,
  tokenId: number,
  price: number
) {
  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: marketplaceAddress(chainId),
    abi: marketplaceContract.abi,
    functionName: 'modifySalePrice',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    args: [contract, tokenId, parseEther(price.toString())],
  })

  return await writeContract(request)
}

export async function mintNewSingleToken(
  chainId: number,
  address: string,
  tokenURI: string,
  to: string,
  royalties: Royalty[]
): Promise<MintResult> {
  const receivers = royalties.map((royalty: Royalty) => royalty.receiver)
  const royaltiesValues = royalties.map((royalty: Royalty) =>
    Math.round(royalty.share * 100)
  )

  // Mint in the marketplace storage
  if (address == storageAddress(chainId)) {
    const { request, result } = await prepareWriteContract({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      address: address,
      abi: storageContract.abi,
      functionName: 'mintWithRoyalties',
      args: [tokenURI, receivers, royaltiesValues],
    })

    const tokenId = parseInt(result as string, 10)
    const writeContractResult = await writeContract(request)
    return {
      writeContractResult,
      resultValue: tokenId,
    }
  }
  const { request, result } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: address,
    abi: boilerplateContract.abi,
    functionName: 'mintWithRoyalties',
    args: [to, tokenURI, receivers, royaltiesValues],
  })

  const tokenId = parseInt(result as string, 10)

  const writeContractResult = await writeContract(request)
  return {
    writeContractResult,
    resultValue: tokenId,
  }
}

export async function createNewERC721Contract(
  chainId: number,
  name: string,
  symbol: string,
  baseURI: string,
  numberOfTokens: number,
  royalties: Royalty[]
): Promise<CreateNewCollection> {
  // prepare royalties array
  const receivers = royalties.map((royalty: Royalty) => royalty.receiver)
  const royaltiesValues = royalties.map((royalty: Royalty) =>
    Math.round(royalty.share * 100)
  )
  const { request, result } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: erc721FactoryAddress(chainId),
    abi: factoryERC721Contract.abi,
    functionName: 'createERC721',
    args: [name, symbol, baseURI, numberOfTokens, receivers, royaltiesValues],
  })

  const contractAddress = result as string
  const writeContractResult = await writeContract(request)
  return {
    writeContractResult,
    resultValue: contractAddress,
  }
}

export async function setNewRoyalty(chainId: number, value: number) {
  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: marketplaceAddress(chainId),
    abi: marketplaceContract.abi,
    functionName: 'setMarketplaceRoyalty',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    args: [value],
  })

  return await writeContract(request)
}

export async function cleanMarketplaceStorage(chainId: number) {
  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: marketplaceAddress(chainId),
    abi: marketplaceContract.abi,
    functionName: 'cleanStorage',
  })

  return await writeContract(request)
}

export async function updateCollectionRoyalties(
  address: string,
  royalties: Royalty[]
) {
  const receivers = royalties.map((royalty: Royalty) => royalty.receiver)
  const royaltiesValues = royalties.map((royalty: Royalty) =>
    Math.round(royalty.share * 100)
  )
  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: address,
    abi: erc2981MultiReceiverContract.abi,
    functionName: 'setDefaultRoyalty',
    args: [receivers, royaltiesValues],
  })

  return await writeContract(request)
}

export async function resetDefaultCollectionRoyalties(address: string) {
  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: address,
    abi: erc2981MultiReceiverContract.abi,
    functionName: 'deleteDefaultRoyalty',
  })

  return await writeContract(request)
}

export async function updateTokenRoyalties(
  address: string,
  tokenId: number,
  royalties: Royalty[]
) {
  const receivers = royalties.map((royalty: Royalty) => royalty.receiver)
  const royaltiesValues = royalties.map((royalty: Royalty) =>
    Math.round(royalty.share * 100)
  )
  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: address,
    abi: erc2981MultiReceiverContract.abi,
    functionName: 'setTokenRoyalty',
    args: [tokenId, receivers, royaltiesValues],
  })

  return await writeContract(request)
}

export async function resetTokenRoyalty(address: string, tokenId: number) {
  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: address,
    abi: erc2981MultiReceiverContract.abi,
    functionName: 'resetTokenRoyalty',
    args: [tokenId],
  })

  return await writeContract(request)
}

export async function withdrawRoyalty(address: string, index: number) {
  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: address,
    abi: paymentSplitter.abi,
    functionName: 'release',
    args: [index],
  })

  return await writeContract(request)
}

export async function withdrawOwner(chainId: number) {
  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: marketplaceAddress(chainId),
    abi: marketplaceContract.abi,
    functionName: 'withdraw',
  })

  return await writeContract(request)
}

export async function withdrawTo(chainId: number, address: string) {
  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: marketplaceAddress(chainId),
    abi: marketplaceContract.abi,
    functionName: 'withdrawTo',
    args: [address],
  })

  return await writeContract(request)
}

export async function withdrawToAmount(
  chainId: number,
  address: string,
  amount: number
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const amountCorrectFormat = parseEther(amount.toString())
  const { request } = await prepareWriteContract({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    address: marketplaceAddress(chainId),
    abi: marketplaceContract.abi,
    functionName: 'withdrawToAmount',
    args: [address, amountCorrectFormat],
  })

  return await writeContract(request)
}

export const marketplaceAddress = (chainId: number) => {
  if (process.env.REACT_APP_LOCAL_CHAIN_ID == undefined)
    throw new Error('REACT_APP_LOCAL_CHAIN_ID is undefined')
  if (process.env.REACT_APP_SEPOLIA_CHAIN_ID === undefined)
    throw new Error('REACT_APP_SEPOLIA_CHAIN_ID is undefined')

  if (chainId === parseInt(process.env.REACT_APP_SEPOLIA_CHAIN_ID))
    return process.env.REACT_APP_SEPOLIA_MARKETPLACE_ADDRESS
  else if (chainId === parseInt(process.env.REACT_APP_LOCAL_CHAIN_ID))
    return process.env.REACT_APP_LOCAL_MARKETPLACE_ADDRESS
  else throw new Error('Chain ID not supported')
}

export const storageAddress = (chainId: number) => {
  if (process.env.REACT_APP_LOCAL_CHAIN_ID === undefined)
    throw new Error('REACT_APP_LOCAL_CHAIN_ID is undefined')
  if (process.env.REACT_APP_SEPOLIA_CHAIN_ID === undefined)
    throw new Error('REACT_APP_SEPOLIA_CHAIN_ID is undefined')

  if (chainId === parseInt(process.env.REACT_APP_SEPOLIA_CHAIN_ID))
    return process.env.REACT_APP_SEPOLIA_SHOPYCHANGE_STORAGE_ADDRESS
  else if (chainId === parseInt(process.env.REACT_APP_LOCAL_CHAIN_ID))
    return process.env.REACT_APP_LOCAL_SHOPYCHANGE_STORAGE_ADDRESS
  else throw new Error('Chain ID not supported')
}

export const erc721FactoryAddress = (chainId: number) => {
  if (process.env.REACT_APP_LOCAL_CHAIN_ID === undefined)
    throw new Error('REACT_APP_LOCAL_CHAIN_ID is undefined')
  if (process.env.REACT_APP_SEPOLIA_CHAIN_ID === undefined)
    throw new Error('REACT_APP_SEPOLIA_CHAIN_ID is undefined')

  if (chainId === parseInt(process.env.REACT_APP_SEPOLIA_CHAIN_ID))
    return process.env.REACT_APP_SEPOLIA_SHOPYCHANGE_ERC721_FACTORY_ADDRESS
  else if (chainId === parseInt(process.env.REACT_APP_LOCAL_CHAIN_ID))
    return process.env.REACT_APP_LOCAL_SHOPYCHANGE_ERC721_FACTORY_ADDRESS
  else throw new Error('Chain ID not supported')
}
