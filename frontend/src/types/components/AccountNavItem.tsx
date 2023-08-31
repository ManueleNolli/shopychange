import { ReactElement } from 'react'

export type AccountNavItem = {
  label: string
  icon?: ReactElement
  href?: string
  action?: () => void
}
