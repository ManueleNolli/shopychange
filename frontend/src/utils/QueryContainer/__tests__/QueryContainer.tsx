import React from 'react'
import { render } from '@testing-library/react'
import QueryContainer from '../QueryContainer'

jest.mock('../../../components/Error/Error', () => ({
  __esModule: true,
  default: () => <div data-testid="Error">Error</div>,
}))

jest.mock('../../../components/LoadingSpinner/LoadingSpinner')

test('should render loading spinner when isLoading is true', () => {
  const { getByTestId } = render(
    <QueryContainer isLoading={true} isError={false}>
      <div data-testid="content">Content</div>
    </QueryContainer>
  )

  expect(getByTestId('LoadingSpinner')).toBeInTheDocument()
  expect(() => getByTestId('content')).toThrow()
})

test('should render error component when isError is true', () => {
  const { getByTestId } = render(
    <QueryContainer isLoading={false} isError={true}>
      <div data-testid="content">Content</div>
    </QueryContainer>
  )

  expect(getByTestId('Error')).toBeInTheDocument()
  expect(() => getByTestId('content')).toThrow()
})

test('should render children when isLoading and isError are false', () => {
  const { getByTestId } = render(
    <QueryContainer isLoading={false} isError={false}>
      <div data-testid="content">Content</div>
    </QueryContainer>
  )

  expect(getByTestId('content')).toBeInTheDocument()
})
