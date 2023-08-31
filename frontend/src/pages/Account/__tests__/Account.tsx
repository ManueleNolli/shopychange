import React from 'react'
import { render } from '@testing-library/react'
import Account from '../Account'
import { TbPhoto, TbPhotoStar, TbPhotoCog } from 'react-icons/tb'
import { SidebarData } from '../../../data/accountSidebarData'
import { Text } from '@chakra-ui/react'
import useAccount from '../useAccount'

jest.mock('../MyNFTs/MyNFTs')

jest.mock('../Sidebar/Sidebar')

jest.mock('../useAccount', () => jest.fn())

const mockedData: SidebarData[] = [
  {
    icon: <TbPhoto size="24px" />,
    text: 'My NFTs',
    route: 'my-nfts',
    component: <Text> My NFTs </Text>,
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
    component: <Text> Observed Collections </Text>,
  },
]

describe('Account', () => {
  test('should render the Sidebar component', () => {
    ;(useAccount as jest.Mock).mockReturnValue({
      isMobile: true,
      changeActivePage: jest.fn(),
    })
    const tree = render(<Account sidebarData={mockedData} page="my-nfts" />)
    expect(tree.getByTestId('Sidebar')).toBeInTheDocument()
  })
})
