import React from 'react'

import { Box } from '@chakra-ui/react'

import Header from './Header/Header'
import Footer from './Footer/Footer'
import { ACCOUNT_NAV_ITEMS, NAV_ITEMS } from '../../data/data'

type TemplateProps = {
  children: React.ReactNode
  header?: boolean
  footer?: boolean
}

export default function PageLayout({
  children,
  header = true,
  footer = true,
}: TemplateProps) {
  return (
    <Box minH="100vh" display="flex" flexFlow="column nowrap">
      {header && (
        <Header navItems={NAV_ITEMS} accountItems={ACCOUNT_NAV_ITEMS} />
      )}
      <Box flexGrow={1}>{children}</Box>
      {footer && <Footer />}
    </Box>
  )
}
