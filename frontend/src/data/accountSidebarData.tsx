import React from 'react'
import { TbPhotoCog, TbPhoto, TbPhotoStar } from 'react-icons/tb'

import MyNFTs from '../pages/Account/MyNFTs/MyNFTs'
import { Text } from '@chakra-ui/react'
import ObservedCollections from '../pages/Account/ObservedCollections/ObservedCollections'

export type SidebarData = {
  icon: React.ReactNode
  text: string
  route: string
  component: React.ReactNode
}

export const data: SidebarData[] = [
  {
    icon: <TbPhoto size="24px" />,
    text: 'My NFTs',
    route: 'my-nfts',
    component: <MyNFTs />,
  },
  {
    icon: <TbPhotoStar size="24px" />,
    text: 'Favorites NFTs',
    route: 'favourite-nfts',
    component: <Text> Favourite </Text>,
  },
  {
    icon: <TbPhotoCog size="24px" />,
    text: 'Observed Collections',
    route: 'observed-collections',
    component: <ObservedCollections />,
  },
]
