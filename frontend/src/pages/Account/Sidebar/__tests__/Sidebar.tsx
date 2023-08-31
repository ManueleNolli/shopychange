import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Sidebar from '../Sidebar'
import { TbPhoto, TbPhotoStar, TbPhotoCog } from 'react-icons/tb'
import { Text } from '@chakra-ui/react'
import { SidebarDataWithActive } from '../../Account'

const mockedData: SidebarDataWithActive[] = [
  {
    icon: <TbPhoto size="24px" />,
    text: 'My NFTs',
    route: 'my-nfts',
    component: <Text> My NFTs </Text>,
    active: true,
  },
  {
    icon: <TbPhotoStar size="24px" />,
    text: 'Favorites NFTs',
    route: 'favourite-nfts',
    component: <Text> Favourite </Text>,
    active: false,
  },
  {
    icon: <TbPhotoCog size="24px" />,
    text: 'Observed Collections',
    route: 'observed-collections',
    component: <Text> Observed Collections </Text>,
    active: false,
  },
]
const mockOnClick = jest.fn()

describe('Sidebar', () => {
  test('should render the Sidebar component row open', () => {
    const tree = render(
      <Sidebar data={mockedData} onClick={mockOnClick}>
        <div data-testid="children">children</div>
      </Sidebar>
    )
    expect(tree.getByText('My NFTs')).toBeInTheDocument()
    expect(tree.getByText('Favorites NFTs')).toBeInTheDocument()
    expect(tree.getByText('Observed Collections')).toBeInTheDocument()
    expect(tree.getByTestId('children')).toBeInTheDocument()
    expect(tree.container).toMatchSnapshot()
  })

  test('should render the Sidebar component row close', () => {
    const tree = render(
      <Sidebar data={mockedData} onClick={mockOnClick}>
        <div data-testid="children">children</div>
      </Sidebar>
    )

    fireEvent.click(tree.getByTestId('toggle-sidebar'))

    expect(tree.container).toMatchSnapshot()
  })

  test('should render the Sidebar component columns', () => {
    const tree = render(
      <Sidebar data={mockedData} onClick={mockOnClick} direction="column">
        <div data-testid="children">children</div>
      </Sidebar>
    )
    expect(tree.getByTestId('children')).toBeInTheDocument()
    expect(tree.container).toMatchSnapshot()
  })

  test('should call onClick row', () => {
    const tree = render(
      <Sidebar data={mockedData} onClick={mockOnClick}>
        <div data-testid="children">children</div>
      </Sidebar>
    )
    fireEvent.click(tree.getByText('Favorites NFTs'))
    expect(mockOnClick).toHaveBeenCalled()
    expect(tree.container).toMatchSnapshot()
  })
  test('should call onClick column', () => {
    const tree = render(
      <Sidebar data={mockedData} onClick={mockOnClick} direction="column">
        <div data-testid="children">children</div>
      </Sidebar>
    )
    fireEvent.click(tree.getAllByTestId('item-row-onclick')[0])
    expect(mockOnClick).toHaveBeenCalled()
    expect(tree.container).toMatchSnapshot()
  })
})
