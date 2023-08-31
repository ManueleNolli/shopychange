import {
  askApproval,
  createSale,
  buy,
  cancelSale,
  modifySale,
  waitTransaction,
  mintNewSingleToken,
  createNewERC721Contract,
  marketplaceAddress,
  storageAddress,
  erc721FactoryAddress,
  updateCollectionRoyalties,
  resetDefaultCollectionRoyalties,
  updateTokenRoyalties,
  resetTokenRoyalty,
  withdrawRoyalty,
  withdrawOwner,
  withdrawTo,
  withdrawToAmount,
  setNewRoyalty,
  cleanMarketplaceStorage,
} from '../BlockchainService'
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from '@wagmi/core'
import { clear } from 'console'
import { Hash, WaitForTransactionReceiptParameters, parseEther } from 'viem'

// Mock the external dependencies
jest.mock('@wagmi/core', () => ({
  prepareWriteContract: jest.fn(),
  writeContract: jest.fn(),
  waitForTransaction: jest.fn(),
}))

jest.mock('wagmi', () => ({
  erc721ABI: 'mockedABI',
}))
jest.mock('viem', () => ({
  parseEther: jest.fn(),
}))
jest.mock('../../../.env', () => ({
  REACT_APP_SEPOLIA_MARKETPLACE_ADDRESS: 'mockedAddress',
}))

const clearLocalChainId = () => {
  delete process.env.REACT_APP_LOCAL_CHAIN_ID
}

const clearSepoliaChainId = () => {
  delete process.env.REACT_APP_SEPOLIA_CHAIN_ID
}

const setChainId = () => {
  ;(process.env.REACT_APP_LOCAL_CHAIN_ID as string) = '1337'
  ;(process.env.REACT_APP_SEPOLIA_CHAIN_ID as string) = '11155111'
}

describe('BlockchainService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('marketplaceAddress', () => {
    test('should return Sepolia marketplace address for Sepolia chain ID', () => {
      const address = marketplaceAddress(11155111)
      expect(address).toBe(process.env.REACT_APP_SEPOLIA_MARKETPLACE_ADDRESS)
    })

    test('should return local marketplace address for local chain ID', () => {
      const address = marketplaceAddress(1337)
      expect(address).toBe(process.env.REACT_APP_LOCAL_MARKETPLACE_ADDRESS)
    })

    test('error if chain ID not supported', () => {
      clearLocalChainId()
      // expect error
      expect(() => marketplaceAddress(1337)).toThrow(
        'REACT_APP_LOCAL_CHAIN_ID is undefined'
      )

      setChainId()
      clearSepoliaChainId()
      expect(() => marketplaceAddress(11155111)).toThrow(
        'REACT_APP_SEPOLIA_CHAIN_ID is undefined'
      )

      setChainId()
    })

    test('should throw error for unsupported chain ID', () => {
      expect(() => marketplaceAddress(42)).toThrow('Chain ID not supported')
    })
  })

  describe('storageAddress', () => {
    test('should return Sepolia storage address for Sepolia chain ID', () => {
      const address = storageAddress(11155111)
      expect(address).toBe(
        process.env.REACT_APP_SEPOLIA_SHOPYCHANGE_STORAGE_ADDRESS
      )
    })

    test('should return local storage address for local chain ID', () => {
      const address = storageAddress(1337)
      expect(address).toBe(
        process.env.REACT_APP_LOCAL_SHOPYCHANGE_STORAGE_ADDRESS
      )
    })
    test('error if chain ID not supported', () => {
      clearLocalChainId()
      // expect error
      expect(() => storageAddress(1337)).toThrow(
        'REACT_APP_LOCAL_CHAIN_ID is undefined'
      )

      setChainId()
      clearSepoliaChainId()
      expect(() => storageAddress(11155111)).toThrow(
        'REACT_APP_SEPOLIA_CHAIN_ID is undefined'
      )

      setChainId()
    })

    test('should throw error for unsupported chain ID', () => {
      expect(() => storageAddress(42)).toThrow('Chain ID not supported')
    })
  })

  describe('erc721FactoryAddress', () => {
    test('should return Sepolia ERC721 factory address for Sepolia chain ID', () => {
      const address = erc721FactoryAddress(11155111)
      expect(address).toBe(
        process.env.REACT_APP_SEPOLIA_SHOPYCHANGE_ERC721_FACTORY_ADDRESS
      )
    })

    test('error if chain ID not supported', () => {
      clearLocalChainId()
      // expect error
      expect(() => erc721FactoryAddress(1337)).toThrow(
        'REACT_APP_LOCAL_CHAIN_ID is undefined'
      )

      setChainId()
      clearSepoliaChainId()
      expect(() => erc721FactoryAddress(11155111)).toThrow(
        'REACT_APP_SEPOLIA_CHAIN_ID is undefined'
      )

      setChainId()
    })

    test('should return local ERC721 factory address for local chain ID', () => {
      const address = erc721FactoryAddress(1337)
      expect(address).toBe(
        process.env.REACT_APP_LOCAL_SHOPYCHANGE_ERC721_FACTORY_ADDRESS
      )
    })

    test('should throw error for unsupported chain ID', () => {
      expect(() => erc721FactoryAddress(42)).toThrow('Chain ID not supported')
    })
  })

  test('askApproval should call prepareWriteContract and writeContract with the correct arguments', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedResult')

    const contract = 'mockedContract'
    const tokenId = 0x02

    const result = await askApproval(11155111, contract, tokenId)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: contract,
      abi: 'mockedABI',
      functionName: 'approve',
      args: [process.env.REACT_APP_SEPOLIA_MARKETPLACE_ADDRESS, tokenId],
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')

    expect(result).toEqual('mockedResult')
  })

  test('createSale should call prepareWriteContract and writeContract with the correct arguments', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedResult')

    const contract = 'mockedContract'
    const tokenId = 0x02
    const price = 100

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const priceCorrect = parseEther(price)

    const result = await createSale(11155111, contract, tokenId, price)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: process.env.REACT_APP_SEPOLIA_MARKETPLACE_ADDRESS,
      abi: expect.any(Array),
      functionName: 'createSale',
      args: [contract, tokenId, priceCorrect],
    })
    expect(writeContract).toHaveBeenCalledWith('mockedRequest')

    expect(result).toEqual('mockedResult')
  })

  test('waitTransaction should call waitForTransaction with the correct arguments', async () => {
    const hash: Hash = '0x1234'
    const waitTransactionParameters: WaitForTransactionReceiptParameters = {
      timeout: 1000,
      hash,
    }

    await waitTransaction(waitTransactionParameters)
    expect(waitForTransaction).toHaveBeenCalledWith(waitTransactionParameters)
  })

  test('buy', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedResult')

    const contract = 'mockedContract'
    const tokenId = 0x02
    const price = 100

    const result = await buy(11155111, contract, tokenId, price)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: process.env.REACT_APP_SEPOLIA_MARKETPLACE_ADDRESS,
      abi: expect.arrayContaining([]),
      functionName: 'buy',
      args: [contract, tokenId],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      value: parseEther(price.toString()),
    })
    expect(writeContract).toHaveBeenCalledWith('mockedRequest')

    expect(result).toEqual('mockedResult')
  })

  test('cancelSale should call writeContract with the correct arguments', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedResult')

    const contract = 'mockedContract'
    const tokenId = 0x02

    const result = await cancelSale(11155111, contract, tokenId)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: process.env.REACT_APP_SEPOLIA_MARKETPLACE_ADDRESS,
      abi: expect.any(Array),
      functionName: 'cancelSale',
      args: [contract, tokenId],
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual('mockedResult')
  })

  test('modifySale should call writeContract with the correct arguments', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedResult')

    const contract = 'mockedContract'
    const tokenId = 0x02
    const price = 5

    const result = await modifySale(11155111, contract, tokenId, price)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: process.env.REACT_APP_SEPOLIA_MARKETPLACE_ADDRESS,
      abi: expect.any(Array),
      functionName: 'modifySalePrice',
      args: [contract, tokenId, parseEther(price.toString())],
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual('mockedResult')
  })

  test('mint New Single Token should call writeContract with the correct arguments, general address', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
      result: 10,
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedContractResult')

    const contract = 'mockedContract'
    const tokenURI = 'mockedTokenURI'
    const to = 'mockedTo'

    const result = await mintNewSingleToken(11155111, contract, tokenURI, to, [
      {
        receiver: 'mockedReceiver1',
        share: 0.5,
      },
    ])

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: contract,
      abi: expect.any(Array),
      functionName: 'mintWithRoyalties',
      args: [to, tokenURI, ['mockedReceiver1'], [50]],
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual({
      writeContractResult: 'mockedContractResult',
      resultValue: 10,
    })
  })

  test('mint New Single Token should call writeContract with the correct arguments, storage address', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
      result: 10,
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedContractResult')

    if (
      process.env.REACT_APP_SEPOLIA_SHOPYCHANGE_STORAGE_ADDRESS === undefined
    ) {
      throw new Error(
        'REACT_APP_SEPOLIA_SHOPYCHANGE_STORAGE_ADDRESS is undefined'
      )
    }

    const contract = process.env.REACT_APP_SEPOLIA_SHOPYCHANGE_STORAGE_ADDRESS
    const tokenURI = 'mockedTokenURI'
    const to = 'mockedTo'

    const result = await mintNewSingleToken(
      11155111,
      contract,
      tokenURI,
      to,
      []
    )

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: process.env.REACT_APP_SEPOLIA_SHOPYCHANGE_STORAGE_ADDRESS,
      abi: expect.any(Array),
      functionName: 'mintWithRoyalties',
      args: [tokenURI, [], []],
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual({
      writeContractResult: 'mockedContractResult',
      resultValue: 10,
    })
  })

  test('Create new collection should call writeContract with the correct arguments', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
      result: 'mockedResult',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedContractResult')

    const name = 'mockedName'
    const symbol = 'mockedSymbol'
    const baseURI = 'mockedBaseURI'
    const numTokens = 10
    const result = await createNewERC721Contract(
      11155111,
      name,
      symbol,
      baseURI,
      numTokens,
      [
        {
          receiver: 'mockedReceiver1',
          share: 0.5,
        },
      ]
    )

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: process.env.REACT_APP_SEPOLIA_SHOPYCHANGE_ERC721_FACTORY_ADDRESS,
      abi: expect.any(Array),
      functionName: 'createERC721',
      args: [name, symbol, baseURI, numTokens, ['mockedReceiver1'], [50]],
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual({
      writeContractResult: 'mockedContractResult',
      resultValue: 'mockedResult',
    })
  })

  test('setNewRoyalty', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
      result: 'mockedResult',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedContractResult')

    const value = 0.5
    const result = await setNewRoyalty(11155111, value)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: process.env.REACT_APP_SEPOLIA_MARKETPLACE_ADDRESS,
      abi: expect.any(Array),
      functionName: 'setMarketplaceRoyalty',
      args: [value],
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual('mockedContractResult')
  })

  test('cleanMarketplaceStorage', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
      result: 'mockedResult',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedContractResult')

    const result = await cleanMarketplaceStorage(11155111)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: process.env.REACT_APP_SEPOLIA_MARKETPLACE_ADDRESS,
      abi: expect.any(Array),
      functionName: 'cleanStorage',
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual('mockedContractResult')
  })

  test('updateCollectionRoyalties', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
      result: 'mockedResult',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedContractResult')

    const address = 'mockedAddress'
    const royalties = [
      { receiver: 'mockedReceiver1', share: 0.5 },
      { receiver: 'mockedReceiver2', share: 0.3 },
      { receiver: 'mockedReceiver3', share: 0.2 },
    ]
    const result = await updateCollectionRoyalties(address, royalties)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: address,
      abi: expect.any(Array),
      functionName: 'setDefaultRoyalty',
      args: [
        ['mockedReceiver1', 'mockedReceiver2', 'mockedReceiver3'],
        [50, 30, 20],
      ],
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual('mockedContractResult')
  })
  test('resetDefaultCollectionRoyalties', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
      result: 'mockedResult',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedContractResult')

    const address = 'mockedAddress'
    const result = await resetDefaultCollectionRoyalties(address)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: address,
      abi: expect.any(Array),
      functionName: 'deleteDefaultRoyalty',
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual('mockedContractResult')
  })

  test('updateTokenRoyalties', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
      result: 'mockedResult',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedContractResult')

    const address = 'mockedAddress'
    const tokenId = 123
    const royalties = [
      { receiver: 'mockedReceiver1', share: 0.5 },
      { receiver: 'mockedReceiver2', share: 0.3 },
      { receiver: 'mockedReceiver3', share: 0.2 },
    ]
    const result = await updateTokenRoyalties(address, tokenId, royalties)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: address,
      abi: expect.any(Array),
      functionName: 'setTokenRoyalty',
      args: [
        tokenId,
        ['mockedReceiver1', 'mockedReceiver2', 'mockedReceiver3'],
        [50, 30, 20],
      ],
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual('mockedContractResult')
  })

  test('resetTokenRoyalty', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
      result: 'mockedResult',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedContractResult')

    const address = 'mockedAddress'
    const tokenId = 123
    const result = await resetTokenRoyalty(address, tokenId)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: address,
      abi: expect.any(Array),
      functionName: 'resetTokenRoyalty',
      args: [tokenId],
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual('mockedContractResult')
  })

  test('withdrawRoyalty', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
      result: 'mockedResult',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedContractResult')

    const address = 'mockedAddress'
    const index = 123
    const result = await withdrawRoyalty(address, index)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: address,
      abi: expect.any(Array),
      functionName: 'release',
      args: [index],
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual('mockedContractResult')
  })

  test('withdrawOwner', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
      result: 'mockedResult',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedContractResult')

    const result = await withdrawOwner(11155111)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: process.env.REACT_APP_SEPOLIA_MARKETPLACE_ADDRESS,
      abi: expect.any(Array),
      functionName: 'withdraw',
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual('mockedContractResult')
  })

  test('withdrawTo', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
      result: 'mockedResult',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedContractResult')

    const address = 'mockedAddress'
    const result = await withdrawTo(11155111, address)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: process.env.REACT_APP_SEPOLIA_MARKETPLACE_ADDRESS,
      abi: expect.any(Array),
      functionName: 'withdrawTo',
      args: [address],
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual('mockedContractResult')
  })

  test('withdrawToAmount', async () => {
    ;(prepareWriteContract as jest.Mock).mockResolvedValue({
      request: 'mockedRequest',
      result: 'mockedResult',
    })
    ;(writeContract as jest.Mock).mockResolvedValue('mockedContractResult')

    const address = 'mockedAddress'
    const amount = 0.1
    const result = await withdrawToAmount(11155111, address, amount)

    expect(prepareWriteContract).toHaveBeenCalledWith({
      address: process.env.REACT_APP_SEPOLIA_MARKETPLACE_ADDRESS,
      abi: expect.any(Array),
      functionName: 'withdrawToAmount',
      args: ['mockedAddress', undefined],
    })

    expect(writeContract).toHaveBeenCalledWith('mockedRequest')
    expect(result).toEqual('mockedContractResult')
  })
})
