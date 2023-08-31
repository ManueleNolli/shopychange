import React from 'react'
import { render, screen } from '@testing-library/react'
import LoadingButton from '../LoadingButton'

describe('LoadingButton', () => {
  test('Should render children when isLoading is false', () => {
    render(<LoadingButton isLoading={false}>Test</LoadingButton>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  test('Should render nothing when isLoading is true', () => {
    render(<LoadingButton isLoading={true}>Test</LoadingButton>)
    expect(screen.queryByText('Test')).not.toBeInTheDocument()
  })
})
