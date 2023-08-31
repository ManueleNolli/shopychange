import React from 'react'
import { render } from '@testing-library/react'
import ShadowButton from '../ShadowButton'

describe('ShadowButton', () => {
  test('renders correctly on Loading', () => {
    const tree = render(
      <ShadowButton
        isLoading={true}
        label={''}
        bgColor={''}
        textColor={''}
        shadowColor={''}
        hoverColor={''}
        focusColor={''}
      />
    )
    expect(tree.getByTestId('loading-button')).toBeInTheDocument()
    expect(tree.queryByTestId('onClick-button')).not.toBeInTheDocument()
    expect(tree.container).toMatchSnapshot()
  })

  test('renders correctly on not Loading', () => {
    const tree = render(
      <ShadowButton
        label={''}
        bgColor={''}
        textColor={''}
        shadowColor={''}
        hoverColor={''}
        focusColor={''}
      />
    )
    expect(tree.getByTestId('onClick-button')).toBeInTheDocument()
    expect(tree.queryByTestId('loading-button')).not.toBeInTheDocument()
    expect(tree.container).toMatchSnapshot()
  })
})
