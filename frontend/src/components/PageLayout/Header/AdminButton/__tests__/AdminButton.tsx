import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import AdminButton from '../AdminButton'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

jest.mock('../../../../../utils/AdminCheck/AdminCheck', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid={'AdminCheck'}>{children}</div>
  ),
}))

describe('AdminButton', () => {
  test('Render', () => {
    const tree = render(<AdminButton />)
    expect(tree.getByTestId('admin-button')).toBeInTheDocument()
    expect(tree.container).toMatchSnapshot()
  })
  test('Navigate', () => {
    const tree = render(<AdminButton />)
    const button = tree.getByTestId('admin-button')
    fireEvent.click(button)
    expect(mockNavigate).toBeCalledTimes(1)
    expect(mockNavigate).toBeCalledWith('/admin')
  })
})
