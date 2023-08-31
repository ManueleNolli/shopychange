import React, { useEffect } from 'react'

import Home from './pages/Home/Home'
import Create from './pages/Create/Create'
import Error from './pages/Error/Error'
import CreateSingleToken from './pages/Create/CreateSingleToken/CreateSingleToken'
import CreateCollection from './pages/Create/CreateCollection/CreateCollection'
import NFTPageRouter from './router/NFTPageRouter'
import CollectionPageRouter from './router/CollectionPageRouter'
import PageLayout from './components/PageLayout/PageLayout'
import AdminCheck from './utils/AdminCheck/AdminCheck'
import Admin from './pages/Admin/Admin'
import CollectionRoyaltiesRouter from './router/CollectionRoyaltiesRouter'
import NFTRoyaltiesRouter from './router/NFTRoyaltiesRouter'
import AccountDashboardPageRouter from './router/AccountDashboardPageRouter'

// graphql
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

export const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql/',
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

// react router
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PageLayout>
        <Home />
      </PageLayout>
    ),
    errorElement: <Error />,
  },
  {
    path: '/account/',
    element: (
      <PageLayout>
        <AccountDashboardPageRouter />
      </PageLayout>
    ),
  },
  {
    path: '/account/dashboard/:page',
    element: (
      <PageLayout>
        <AccountDashboardPageRouter />
      </PageLayout>
    ),
  },
  {
    path: '/account/:address',
    element: (
      <PageLayout>
        <AccountAddressPageRouter />
      </PageLayout>
    ),
  },
  {
    path: '/:contractAddress/:tokenId',
    element: (
      <PageLayout>
        <NFTPageRouter />
      </PageLayout>
    ),
  },
  {
    path: '/:contractAddress',
    element: (
      <PageLayout>
        <CollectionPageRouter />
      </PageLayout>
    ),
  },
  {
    path: '/:contractAddress/royalties',
    element: (
      <PageLayout>
        <CollectionRoyaltiesRouter />
      </PageLayout>
    ),
  },
  {
    path: '/:contractAddress/:tokenId/royalties',
    element: (
      <PageLayout>
        <NFTRoyaltiesRouter />
      </PageLayout>
    ),
  },
  {
    path: '/create',
    element: (
      <PageLayout>
        <Create />
      </PageLayout>
    ),
  },
  {
    path: '/create/nft',
    element: (
      <PageLayout>
        <CreateSingleToken />
      </PageLayout>
    ),
  },
  {
    path: '/create/collection',
    element: (
      <PageLayout>
        <CreateCollection />
      </PageLayout>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminCheck>
        <PageLayout>
          <Admin />
        </PageLayout>
      </AdminCheck>
    ),
  },
])

// chakra ui
import { ChakraProvider, useColorMode } from '@chakra-ui/react'

// wallet connect and wagmi
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import {
  Chain,
  configureChains,
  createConfig,
  useAccount,
  useNetwork,
  WagmiConfig,
} from 'wagmi'
// import { mainnet as ethereum, sepolia } from 'wagmi/chains'
import { sepolia } from 'wagmi/chains'

const hardhat = {
  id: 1337,
  name: 'Hardhat',
  network: 'Hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
    default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
  },
} as const satisfies Chain

import AccountAddressPageRouter from './router/AccountAddressPageRouter'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

if (!process.env.REACT_APP_WALLET_CONNECT_ID) {
  console.error('REACT_APP_WALLET_CONNECT_ID is not defined')
}

if (!process.env.REACT_APP_ALCHEMY_PROJECT_ID) {
  console.error('REACT_APP_ALCHEMY_PROJECT_ID is not defined')
}

const projectId = process.env.REACT_APP_WALLET_CONNECT_ID as string
const alchemyKey = process.env.REACT_APP_ALCHEMY_PROJECT_ID as string

const { chains, publicClient } = configureChains(
  // [ethereum, sepolia, hardhat],
  [sepolia, hardhat],
  [
    alchemyProvider({ apiKey: alchemyKey }),
    jsonRpcProvider({
      rpc: () => ({
        http: 'http://127.0.0.1:8545/',
      }),
    }),
  ]
)
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ chains, projectId }),
  publicClient,
})

const ethereumClient = new EthereumClient(wagmiConfig, chains)

// user provider
import { UserProvider, useUserContext } from './context/userContext'

function App() {
  return (
    <UserProvider>
      <AccountInformation>
        <ChakraProvider>
          <WagmiConfig config={wagmiConfig}>
            <ApolloProvider client={client}>
              <RouterProvider router={router} />
            </ApolloProvider>
          </WagmiConfig>

          <Web3ModalWithTheme />
        </ChakraProvider>
      </AccountInformation>
    </UserProvider>
  )
}

function AccountInformation({ children }: { children: React.ReactNode }) {
  const account = useAccount()
  const { chain } = useNetwork()
  const { updateUserContext, clearUserContext } = useUserContext()

  useEffect(() => {
    if (account.isConnected && chain) {
      updateUserContext(account.address as string, chain.id)
    } else {
      clearUserContext()
    }
  }, [account.address, chain])

  return <>{children}</>
}

function Web3ModalWithTheme() {
  const { colorMode } = useColorMode()
  return (
    <Web3Modal
      enableNetworkView={true}
      projectId={projectId}
      ethereumClient={ethereumClient}
      themeVariables={{
        '--w3m-button-border-radius': '5px',
      }}
      themeMode={colorMode === 'light' ? 'light' : 'dark'}
    />
  )
}

export default App
