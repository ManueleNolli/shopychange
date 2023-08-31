import React from 'react'

import { NavItem } from '../components/NavItem'
import { AccountNavItem } from '../components/AccountNavItem'

export type HeaderProps = {
  navItems?: NavItem[]
  accountItems?: AccountNavItem[]
}
