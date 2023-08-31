import React from 'react'
import { useParams } from 'react-router-dom'
import { data } from '../data/accountSidebarData'
import Account from '../pages/Account/Account'

export default function AccountDashboardPageRouter() {
  const { page } = useParams<{
    page: string
  }>()

  if (!page) {
    return <Account page={data[0].route} sidebarData={data} />
  }

  return <Account page={page} sidebarData={data} />
}
