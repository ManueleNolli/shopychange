import React from 'react'
import ModifySaleManager from '../ModifySaleManager'
import { fireEvent, render, screen } from '@testing-library/react'
import { useDisclosure } from '@chakra-ui/react'

const divWithChildrenMock = (children: any, identifier: string) => (
  <div data-testId={identifier}>{children}</div>
)
const divWithoutChildrenMock = (identifier: string) => (
  <div data-testId={identifier} />
)

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  PortalManager: jest.fn(({ children }) =>
    divWithChildrenMock(children, 'portal')
  ),
  Modal: jest.fn(({ children }) => divWithChildrenMock(children, 'modal')),
  ModalOverlay: jest.fn(({ children }) =>
    divWithChildrenMock(children, 'overlay')
  ),
  ModalContent: jest.fn(({ children }) =>
    divWithChildrenMock(children, 'content')
  ),
  ModalHeader: jest.fn(({ children }) =>
    divWithChildrenMock(children, 'header')
  ),
  ModalFooter: jest.fn(({ children }) =>
    divWithChildrenMock(children, 'footer')
  ),
  ModalBody: jest.fn(({ children }) => divWithChildrenMock(children, 'body')),
  ModalCloseButton: jest.fn(() => divWithoutChildrenMock('close')),

  useDisclosure: jest.fn().mockReturnValue({ isOpen: false }),
}))

jest.mock('../../ModifySalePopoverContent/ModifySalePopoverContent')

const mockProps = {
  nft: {
    contractAddress: '0x0000000000',
    tokenId: 0,
    image:
      'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q',
    name: 'Test NFT',
  },
  actualPrice: 0.4,
}

const onUpdate = jest.fn()

describe('BuyManager', () => {
  test('should open modal', () => {
    const onOpen = jest.fn()
    ;(useDisclosure as jest.Mock).mockReturnValueOnce({
      isOpen: true,
      onOpen,
    })

    render(
      <ModifySaleManager
        nft={mockProps.nft}
        actualPrice={mockProps.actualPrice}
        onUpdate={onUpdate}
      />
    )
    const buyButton = screen.getByText('Modify Sale')
    expect(buyButton).toBeInTheDocument()

    fireEvent.click(buyButton)

    expect(onOpen).toHaveBeenCalledTimes(1)
  })
})
