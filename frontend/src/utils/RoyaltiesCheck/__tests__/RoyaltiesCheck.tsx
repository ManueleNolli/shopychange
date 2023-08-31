import React from 'react'
import { render, act } from '@testing-library/react'
import RoyaltiesCheck from '../RoyaltiesCheck'
import { handlerQueryErrorCatch } from '../../../services/BackendService'
import { useUserContext } from '../../../context/userContext'

jest.mock('../../../services/BackendService', () => ({
  handlerQueryErrorCatch: jest.fn(),
  tokenRoyaltiesQuery: jest.fn(),
  collectionRoyaltiesQuery: jest.fn(),
}))

jest.mock('../../../context/userContext', () => ({
  useUserContext: jest.fn(),
}))

jest.mock('../../../hooks/useFetching', () => () => ({
  isFetching: false,
  setIsFetching: jest.fn(),
  isError: false,
  setIsError: jest.fn(),
}))

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('RoyaltiesCheck', () => {
  test('should return null if not receiver and redirectHome is false', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        withdrawRoyaltyToken: {
          receivers: [],
        },
      },
      error: false,
    })

    const { container } = render(
      <RoyaltiesCheck
        collectionAddress="0x67890"
        tokenId={123}
        redirectHome={false}
      >
        <div>Content</div>
      </RoyaltiesCheck>
    )

    await act(async () => {
      Promise.resolve()
    })

    expect(container.firstChild).toBeNull()
  })

  test('should navigate to home if not receiver and redirectHome is true', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        withdrawRoyaltyToken: {
          receivers: [],
        },
      },
      error: false,
    })

    render(
      <RoyaltiesCheck collectionAddress="0x67890" tokenId={123}>
        <div>Content</div>
      </RoyaltiesCheck>
    )

    await act(async () => {
      Promise.resolve()
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  test('should render children if receiver', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        withdrawRoyaltyToken: {
          receivers: [
            {
              receiver: '0x12345',
              value: '100',
            },
          ],
        },
      },
      error: false,
    })

    const { getByText } = render(
      <RoyaltiesCheck
        collectionAddress="0x67890"
        tokenId={123}
        redirectHome={false}
      >
        <div>Content</div>
      </RoyaltiesCheck>
    )

    await act(async () => {
      Promise.resolve()
    })

    expect(mockNavigate).toHaveBeenCalledTimes(0)
    expect(getByText('Content')).toBeInTheDocument()
  })

  test('should render children if receiver, collection', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        withdrawRoyaltyCollection: {
          receivers: [
            {
              receiver: '0x12345',
              value: '100',
            },
          ],
        },
      },
      error: false,
    })

    const { getByText } = render(
      <RoyaltiesCheck collectionAddress="0x67890" redirectHome={false}>
        <div>Content</div>
      </RoyaltiesCheck>
    )

    await act(async () => {
      Promise.resolve()
    })

    expect(mockNavigate).toHaveBeenCalledTimes(0)
    expect(getByText('Content')).toBeInTheDocument()
  })

  test('should handle error', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {},
      error: true,
    })

    render(
      <RoyaltiesCheck collectionAddress="0x67890" tokenId={123}>
        <div>Content</div>
      </RoyaltiesCheck>
    )

    await act(async () => {
      Promise.resolve()
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })

  test('should handle error, collection', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
      blockchainNetworkId: 1,
    })
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {},
      error: true,
    })

    render(
      <RoyaltiesCheck collectionAddress="0x67890">
        <div>Content</div>
      </RoyaltiesCheck>
    )

    await act(async () => {
      Promise.resolve()
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })

  test('should handle missing user context', async () => {
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: undefined,
    })

    const { container } = render(
      <RoyaltiesCheck collectionAddress="0x67890" tokenId={123}>
        <div>Content</div>
      </RoyaltiesCheck>
    )

    await act(async () => {
      Promise.resolve()
    })

    expect(container.firstChild).toBeNull()
  })
})
