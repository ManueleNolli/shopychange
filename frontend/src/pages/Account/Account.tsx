import React from 'react'

import { Center, Heading, Box } from '@chakra-ui/react'

import Sidebar from './Sidebar/Sidebar'
import { SidebarData } from '../../data/accountSidebarData'
import useAccount from './useAccount'

type AccountProps = {
  sidebarData: SidebarData[]
  page: string
}

export type SidebarDataWithActive = SidebarData & {
  active: boolean
}

export default function Account({ sidebarData, page }: AccountProps) {
  const { isMobile, changeActivePage } = useAccount()

  // Not an hook!
  const pages = sidebarData.map((element) => {
    return {
      ...element,
      active: element.route === page,
    }
  })

  return (
    <Sidebar
      direction={isMobile ? 'column' : 'row'}
      onClick={changeActivePage}
      data={pages}
    >
      {pages.map((page) => {
        if (page.active) {
          return (
            <Box key={page.route}>
              <Center>
                <Heading>{page.text}</Heading>
              </Center>
              {page.component}
            </Box>
          )
        }
      })}
    </Sidebar>
  )
}
