import React from 'react'
import { render } from '@testing-library/react'
import Error from '../Error'

test('renders error page correctly', () => {
  const component = render(<Error />)
  expect(component).toMatchSnapshot()
})
