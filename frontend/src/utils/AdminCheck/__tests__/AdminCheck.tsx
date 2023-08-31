import React from 'react'

import { act, render } from '@testing-library/react'
import AdminCheck from '../AdminCheck'
import { handlerQueryErrorCatch } from '../../../services/BackendService'
import { useUserContext } from '../../../context/userContext'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

jest.mock('../../../services/BackendService', () => ({
  handlerQueryErrorCatch: jest.fn(),
  isAdminQuery: jest.fn(),
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

describe('AdminCheck', () => {
  test('Should return null if is not admin', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        isAdmin: false,
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
      blockchainNetworkId: 1,
    })

    const { container } = render(
      <AdminCheck redirectHome={false}>
        <div>Test</div>
      </AdminCheck>
    )
    await act(async () => {
      Promise.resolve()
    })

    expect(container.firstChild).toBeNull()
  })

  test('Should navigate to "/" if not admin', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        isAdmin: false,
      },
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
      blockchainNetworkId: 1,
    })

    render(
      <AdminCheck>
        <div>Test</div>
      </AdminCheck>
    )
    await act(async () => {
      Promise.resolve()
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  test('Should render the children if admin', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        isAdmin: true,
      },
      error: false,
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
      blockchainNetworkId: 1,
    })
    const tree = render(
      <AdminCheck redirectHome={false}>
        <div>Test</div>
      </AdminCheck>
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
        isAdmin: true,
      },
      error: true,
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: '0x12345',
      blockchainNetworkId: 1,
    })
    render(
      <AdminCheck>
        <div>Test</div>
      </AdminCheck>
    )
    await act(async () => {
      Promise.resolve()
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })

  test('only if logged', async () => {
    ;(handlerQueryErrorCatch as jest.Mock).mockResolvedValueOnce({
      result: {
        isAdmin: true,
      },
      error: true,
    })
    ;(useUserContext as jest.Mock).mockReturnValue({
      userAddress: undefined,
      blockchainNetworkId: 1,
    })
    render(
      <AdminCheck>
        <div>Test</div>
      </AdminCheck>
    )
    await act(async () => {
      Promise.resolve()
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })
})
