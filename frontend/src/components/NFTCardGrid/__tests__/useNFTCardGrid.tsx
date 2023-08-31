import useNFTCardGrid from '../useNFTCardGrid'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

const mockData = [
  {
    contractAddress: '0x0000000000',
    tokenId: 0,
    image:
      'https://ipfs.io/ipfs/bafybeietntip4sq3xmuwiz3s43yb3klrpa3okgtg5deysmbd5hbizhrb2q/0.png',
    name: 'Test NFT',
  },
]

describe('useNFTCardGrid', () => {
  test('should navigate to the correct path', () => {
    const { onNavigation } = useNFTCardGrid()

    onNavigation(mockData[0])

    expect(mockNavigate).toHaveBeenCalledWith(
      `/${mockData[0].contractAddress}/${mockData[0].tokenId}`
    )
  })
})
