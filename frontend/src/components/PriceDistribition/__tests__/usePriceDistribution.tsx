import { renderHook, act } from '@testing-library/react'
import { useUserContext } from '../../../context/userContext'
import { handlerQueryErrorCatch } from '../../../services/BackendService'
import usePriceDistribution from '../usePriceDistribution'

jest.mock('../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

jest.mock('../../../services/BackendService', () => ({
  royaltyQuery: jest.fn(),
  handlerQueryErrorCatch: jest.fn(),
}))

jest.mock('../../../hooks/useFetching', () => () => ({
  isFetching: false,
  setIsFetching: jest.fn(),
  isError: false,
  setIsError: jest.fn(),
}))

const mockProps = {
  address: '0x123',
  tokenId: 1,
  price: 100,
  isOwner: true,
}

describe('usePriceDistribution', () => {
  test('should return correct values', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValue({
      result: {
        marketplaceRoyalty: 10,
        royaltyToken: {
          royalties: [
            {
              recipient: '0x789',
              value: 5,
            },
            {
              recipient: '0xabc',
              value: 7,
            },
          ],
          royaltySum: 12,
        },
      },
    })

    const { result } = renderHook(() => usePriceDistribution(mockProps))

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.settedPrice).toBe(100)
    expect(result.current.otherRoyalties).toEqual([
      {
        recipient: '0x789',
        value: 5,
      },
      {
        recipient: '0xabc',
        value: 7,
      },
    ])
  })

  test('should handle error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      error: true,
      result: {
        marketplaceRoyalty: 10,
        royaltyToken: {
          royalties: [
            {
              recipient: '0x789',
              value: 5,
            },
            {
              recipient: '0xabc',
              value: 7,
            },
          ],
          royaltySum: 12,
        },
      },
    })

    const { result } = renderHook(() => usePriceDistribution(mockProps))

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      result.current
    })

    expect(result.current.otherRoyalties).toEqual([])
  })

  test('fixedNumber', () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x0000001',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      error: true,
    })

    const { fixedNumber } = renderHook(() => usePriceDistribution(mockProps))
      .result.current

    expect(fixedNumber(1.23456789)).toBe(1.2346)
  })

  test('Return when userAddress is undefined', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      error: true,
    })

    renderHook(() => usePriceDistribution(mockProps))

    await act(async () => {
      await Promise.resolve()
    })

    expect(handlerQueryErrorCatch).not.toBeCalled()
  })
})
