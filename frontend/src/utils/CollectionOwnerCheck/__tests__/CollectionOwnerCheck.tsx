import React from 'react'

import { act, render } from '@testing-library/react'
import CollectionOwnerCheck from '../CollectionOwnerCheck'
import { handlerQueryErrorCatch } from '../../../services/BackendService'
import { useUserContext } from '../../../context/userContext'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

jest.mock('../../../services/BackendService', () => ({
  handlerQueryErrorCatch: jest.fn(),
  collectionOwnerQuery: jest.fn(),
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

describe('CollectionOwnerCheck', () => {
  test('Should return null if is not owner', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        collectionOwner: '0x02',
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
      blockchainNetworkId: 1,
    })

    const { container } = render(
      <CollectionOwnerCheck redirectHome={false} collectionAddress="0x01">
        <div>Test</div>
      </CollectionOwnerCheck>
    )
    await act(async () => {
      Promise.resolve()
    })

    expect(container.firstChild).toBeNull()
  })

  test('Should navigate to "/" if not owner', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        collectionOwner: '0x02',
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
      blockchainNetworkId: 1,
    })

    render(
      <CollectionOwnerCheck collectionAddress="0x01">
        <div>Test</div>
      </CollectionOwnerCheck>
    )
    await act(async () => {
      Promise.resolve()
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  test('Should render the children if owner', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        collectionOwner: '0x12345',
      },
      error: false,
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
      blockchainNetworkId: 1,
    })
    const tree = render(
      <CollectionOwnerCheck redirectHome={false} collectionAddress="0x01">
        <div>Test</div>
      </CollectionOwnerCheck>
    )
    await act(async () => {
      Promise.resolve()
    })

    expect(mockNavigate).toHaveBeenCalledTimes(0)
    expect(tree.getByText('Test')).toBeInTheDocument()
  })

  test('fetching error', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        collectionOwner: '0x02',
      },
      error: true,
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x02',
      blockchainNetworkId: 1,
    })
    render(
      <CollectionOwnerCheck collectionAddress="0x01">
        <div>Test</div>
      </CollectionOwnerCheck>
    )
    await act(async () => {
      Promise.resolve()
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })

  test('only if logged', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        collectionOwner: '0x02',
      },
      error: true,
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    render(
      <CollectionOwnerCheck collectionAddress="0x01">
        <div>Test</div>
      </CollectionOwnerCheck>
    )
    await act(async () => {
      Promise.resolve()
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })
})
