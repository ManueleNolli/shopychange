import React from 'react'
import ShadowButton from '../ShadowButton/ShadowButton'
import { LoadingButtonProps } from '../../types/props/LoadingButtonProps'

import { colors } from '../../styles/Colors'

export default function LoadingButton({
  isLoading,
  children,
  loadingButtonProps,
}: LoadingButtonProps) {
  return isLoading ? (
    <ShadowButton
      data-testid="loading-button"
      isLoading={isLoading}
      label={''}
      bgColor={`${colors.loadingChakraColor}.500`}
      textColor={''}
      shadowColor={`${colors.loadingChakraColor}.300`}
      hoverColor={`${colors.loadingChakraColor}.300`}
      focusColor={`${colors.loadingChakraColor}.300`}
      buttonProps={loadingButtonProps}
    />
  ) : (
    <>{children}</>
  )
}
