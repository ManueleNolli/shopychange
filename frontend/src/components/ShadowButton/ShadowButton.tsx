import React from 'react'

import { Button, ButtonProps } from '@chakra-ui/react'
import BeatLoader from 'react-spinners/BeatLoader'

export type ShadowButtonProps = {
  label: string
  bgColor: string
  textColor: string
  shadowColor: string
  hoverColor: string
  focusColor: string
  onClick?: () => void
  isLoading?: boolean
  isDisabled?: boolean
  buttonProps?: ButtonProps
  type?: 'button' | 'submit' | 'reset'
}

export default function ShadowButton({
  label,
  bgColor,
  textColor,
  shadowColor,
  hoverColor,
  focusColor,
  onClick,
  isLoading,
  isDisabled = false,
  buttonProps,
  type = 'button',
}: ShadowButtonProps) {
  const shadowColor1 = `${shadowColor}7A`
  const shadowColor2 = `${shadowColor}6E`
  return isLoading ? (
    <Button
      data-testid="loading-button"
      isLoading
      w="6em"
      spinner={<BeatLoader size={8} color="white" />}
      bg={bgColor}
      color={textColor}
      boxShadow={`0px 1px 25px -5px ${shadowColor1}, 0 10px 10px -5px ${shadowColor2}`}
      _hover={{
        bg: hoverColor,
      }}
      _focus={{
        bg: focusColor,
      }}
      {...buttonProps}
    />
  ) : (
    <Button
      type={type}
      data-testid="onClick-button"
      isDisabled={isDisabled}
      onClick={onClick}
      bg={bgColor}
      style={{ whiteSpace: 'initial' }}
      color={textColor}
      boxShadow={`0px 1px 25px -5px ${shadowColor1}, 0 10px 10px -5px ${shadowColor2}`}
      _hover={{
        bg: hoverColor,
        cursor: isDisabled ? 'default' : 'pointer',
      }}
      _focus={{
        bg: focusColor,
      }}
      _disabled={{ bg: bgColor }}
      {...buttonProps}
    >
      {label}
    </Button>
  )
}
