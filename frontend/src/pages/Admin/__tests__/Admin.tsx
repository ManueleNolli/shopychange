import React from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import Admin from '../Admin'
import useAdmin from '../useAdmin'

jest.mock('../../../utils/SimplifiedAddress/SimplifiedAddress', () => ({
  simplifiedAddress: jest.fn((address: string) => address),
}))

jest.mock('../useAdmin', () => jest.fn())

describe('Admin', () => {
  test('should render the component', async () => {
    ;(useAdmin as jest.Mock).mockReturnValue({
      royaltyValue: 0,
      marketplaceBalance: 0,
      setNewRoyaltyValue: jest.fn(),
      isNewRoyaltyValueLoading: false,
      updateRoyaltyValue: jest.fn(),
      cleanStorage: jest.fn(),
      isCleanStorageLoading: false,
      sales: [],
      isCancelSaleLoading: false,
      onCancelSale: jest.fn(),
      withdraw: jest.fn(),
      isWithdrawLoading: false,
      withdrawToAll: jest.fn(),
      isWithdrawToLoading: false,
      withdrawToAmount: jest.fn(),
      isWithdrawToAmountLoading: false,
      setSaleToCancel: jest.fn(),
    })

    const tree = render(<Admin />)
    expect(tree.container).toMatchSnapshot()
  })

  test('should call change new royalty value', async () => {
    const setNewRoyaltyMock = jest.fn()

    ;(useAdmin as jest.Mock).mockReturnValue({
      royaltyValue: 0,
      marketplaceBalance: 0,
      setNewRoyaltyValue: setNewRoyaltyMock,
      isNewRoyaltyValueLoading: false,
      updateRoyaltyValue: jest.fn(),
      cleanStorage: jest.fn(),
      isCleanStorageLoading: false,
      sales: [],
      isCancelSaleLoading: false,
      onCancelSale: jest.fn(),
      withdraw: jest.fn(),
      isWithdrawLoading: false,
      withdrawToAll: jest.fn(),
      isWithdrawToLoading: false,
      withdrawToAmount: jest.fn(),
      isWithdrawToAmountLoading: false,
      setSaleToCancel: jest.fn(),
    })

    const tree = render(<Admin />)

    const input = tree.getByTestId('input-royalty')
    expect(input).toBeInTheDocument()

    await act(async () => {
      fireEvent.change(input, { target: { value: 10 } })
    })

    expect(setNewRoyaltyMock).toHaveBeenCalledWith(10)
  })

  test('should call submit, witdrawToAll', async () => {
    const withdrawToAllMock = jest.fn()

    ;(useAdmin as jest.Mock).mockReturnValue({
      royaltyValue: 0,
      marketplaceBalance: 0,
      setNewRoyaltyValue: jest.fn(),
      isNewRoyaltyValueLoading: false,
      updateRoyaltyValue: jest.fn(),
      cleanStorage: jest.fn(),
      isCleanStorageLoading: false,
      sales: [],
      isCancelSaleLoading: false,
      onCancelSale: jest.fn(),
      withdraw: jest.fn(),
      isWithdrawLoading: false,
      withdrawToAll: withdrawToAllMock,
      isWithdrawToLoading: false,
      withdrawToAmount: jest.fn(),
      isWithdrawToAmountLoading: false,
      setSaleToCancel: jest.fn(),
    })

    const tree = render(<Admin />)

    const addressInput = tree.queryAllByPlaceholderText('to')[0]

    const submitButton = tree.queryAllByText('Withdraw To')[1]

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: '0x965A25dA356e75a58bEBEEA63C3050540259adB2' },
      })
    })

    await act(async () => {
      fireEvent.click(submitButton)
    })

    expect(withdrawToAllMock).toHaveBeenCalled()
  })

  test('should call submit, witdrawToAmount', async () => {
    const withdrawToAmountMock = jest.fn()

    ;(useAdmin as jest.Mock).mockReturnValue({
      royaltyValue: 0,
      marketplaceBalance: 0,
      setNewRoyaltyValue: jest.fn(),
      isNewRoyaltyValueLoading: false,
      updateRoyaltyValue: jest.fn(),
      cleanStorage: jest.fn(),
      isCleanStorageLoading: false,
      sales: [],
      isCancelSaleLoading: false,
      onCancelSale: jest.fn(),
      withdraw: jest.fn(),
      isWithdrawLoading: false,
      withdrawToAll: jest.fn(),
      isWithdrawToLoading: false,
      withdrawToAmount: withdrawToAmountMock,
      isWithdrawToAmountLoading: false,
      setSaleToCancel: jest.fn(),
    })

    const tree = render(<Admin />)

    const addressInput = tree.queryAllByPlaceholderText('to')[1]
    const numberInput = tree.queryAllByPlaceholderText('Amount')[0]

    const submitButton = tree.queryAllByText('Withdraw To Amount')[1]

    await act(async () => {
      fireEvent.change(addressInput, {
        target: { value: '0x965A25dA356e75a58bEBEEA63C3050540259adB2' },
      })

      fireEvent.change(numberInput, {
        target: { value: 10 },
      })
    })

    await act(async () => {
      fireEvent.click(submitButton)
    })

    expect(withdrawToAmountMock).toHaveBeenCalled()
  })

  test('should call submit, witdrawToAmount', async () => {
    const SetSaleToCancelMock = jest.fn()

    ;(useAdmin as jest.Mock).mockReturnValue({
      royaltyValue: 0,
      marketplaceBalance: 0,
      setNewRoyaltyValue: jest.fn(),
      isNewRoyaltyValueLoading: false,
      updateRoyaltyValue: jest.fn(),
      cleanStorage: jest.fn(),
      isCleanStorageLoading: false,
      sales: [
        {
          contractAddress: 'mockContractAddress',
          tokenId: 0,
          image: 'mockImage',
          name: 'mockName',
        },
        {
          contractAddress: 'mockContractAddress1',
          tokenId: 1,
          image: 'mockImage',
          name: 'mockName',
        },
      ],
      isCancelSaleLoading: false,
      onCancelSale: jest.fn(),
      withdraw: jest.fn(),
      isWithdrawLoading: false,
      withdrawToAll: jest.fn(),
      isWithdrawToLoading: false,
      withdrawToAmount: jest.fn(),
      isWithdrawToAmountLoading: false,
      setSaleToCancel: SetSaleToCancelMock,
    })

    const tree = render(<Admin />)

    const select = tree.getByTestId('select-sale')
    expect(select).toBeInTheDocument()

    await act(async () => {
      fireEvent.change(select, {
        target: { value: 'mockContractAddress' },
      })
    })

    expect(SetSaleToCancelMock).toHaveBeenCalledWith({
      contractAddress: 'mockContractAddress',
      tokenId: 0,
      image: 'mockImage',
      name: 'mockName',
    })
  })
})
