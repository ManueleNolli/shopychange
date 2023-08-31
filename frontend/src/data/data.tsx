import React from 'react'
import { AccountNavItem } from '../types/components/AccountNavItem'
import { NavItem } from '../types/components/NavItem'

import { FaUser, FaEye } from 'react-icons/fa'
import { HiPencil } from 'react-icons/hi'
import { IoExit } from 'react-icons/io5'

import { disconnect } from '@wagmi/core'

export const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  {
    label: 'Profile',
    icon: <FaUser />,
    href: '/account',
  },
  {
    label: 'Watchlist',
    icon: <FaEye />,
    href: '/account/watchlist',
  },
  {
    label: 'Create',
    icon: <HiPencil />,
    href: '/create',
  },
  {
    label: 'Disconnect',
    icon: <IoExit />,
    action: () => {
      disconnect()
    },
  },
]

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Marketplace',
    children: [
      {
        label: 'All NFTs',
        subLabel: 'Discover all NFTs for sale',
        href: '#',
      },
      {
        label: 'Auctions',
        subLabel: 'Try your luck on an auction',
        href: '#',
      },
    ],
  },
  // {
  //   label: 'Drops',
  // },
  // {
  //   label: 'Stats',
  //   href: '#',
  //   children: [
  //     {
  //       label: 'Most popular collections',
  //       subLabel: 'Discover the most popular collections',
  //       href: '#',
  //     },
  //     {
  //       label: 'Most popular creators',
  //       subLabel: 'Discover the most popular creators',
  //       href: '#',
  //     },
  //     {
  //       label: 'Shopychange analytics',
  //       subLabel: 'Our analytics on the NFT market',
  //       href: '#',
  //     },
  //   ],
  // },
]
