import React from 'react'
import { render } from '@testing-library/react'
import PageLayout from '../PageLayout'

jest.mock('../Header/Header')

jest.mock('../Footer/Footer')

jest.mock('@wagmi/core', () => ({
  disconnect: jest.fn(),
}))

describe('PageLayout', () => {
  test('renders correctly', () => {
    const tree = render(
      <PageLayout>
        <div data-testid={'children'}>Children</div>
      </PageLayout>
    )
    expect(tree.container).toMatchSnapshot()
  })
  test('renders correctly without header', () => {
    const tree = render(
      <PageLayout header={false}>
        <div data-testid={'children'}>Children</div>
      </PageLayout>
    )
    expect(tree.container).toMatchSnapshot()
  })
  test('renders correctly without footer', () => {
    const tree = render(
      <PageLayout footer={false}>
        <div data-testid={'children'}>Children</div>
      </PageLayout>
    )
    expect(tree.container).toMatchSnapshot()
  })
  test('renders correctly without footer and header', () => {
    const tree = render(
      <PageLayout footer={false} header={false}>
        <div data-testid={'children'}>Children</div>
      </PageLayout>
    )
    expect(tree.container).toMatchSnapshot()
  })
})
