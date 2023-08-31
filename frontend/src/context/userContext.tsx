import React, { createContext, useContext, useState, ReactNode } from 'react'

interface UserContextType {
  userAddress: string | null
  blockchainNetworkId: number | null
  updateUserContext: (address: string, network: number) => void
  clearUserContext: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [blockchainNetworkId, setBlockchainNetworkId] = useState<number | null>(
    null
  )

  const updateUserContext = (address: string, networkId: number) => {
    setUserAddress(address)
    setBlockchainNetworkId(networkId)
  }

  const clearUserContext = () => {
    setUserAddress(null)
    setBlockchainNetworkId(null)
  }

  return (
    <UserContext.Provider
      value={{
        userAddress,
        blockchainNetworkId,
        updateUserContext,
        clearUserContext,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext(): UserContextType {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}
