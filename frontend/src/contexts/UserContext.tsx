import { createContext, useContext, useEffect, useState } from "react";
import { logout } from "../utilities/fetch";

export type TokensType = {
  access: string
  refresh: string
}

type UserContextType = {
  tokens: TokensType | null
  setTokens: React.Dispatch<React.SetStateAction<TokensType | null>>
}

const initialUserContext: UserContextType = {
  tokens: null,
  setTokens: () => { },
}

const UserContext = createContext(initialUserContext)

type UserProviderProps = {
  children: React.ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [tokens, setTokens] = useState<TokensType | null>(() => {
    const storageTokens = localStorage.getItem('tokens')
    return storageTokens ? JSON.parse(storageTokens) : null
  })

  async function getNewAccessToken() {
    if (!tokens) return
    const res = await fetch('http://localhost:4000/api/users/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: tokens?.refresh })
    })
    const data = await res.json()
    if (!res.ok) {
      // TODO need refactor
      logout(tokens.refresh)
      setTokens(null)
      localStorage.removeItem('tokens')
      throw new Error(data.error)
    }
    console.log(data)
    setTokens({ ...tokens, access: data.access })
    localStorage.setItem('tokens', JSON.stringify({ access: data.access, refresh: tokens.refresh }))
  }

  useEffect(() => {
    if (tokens?.refresh)
      getNewAccessToken()
  }, [tokens?.refresh])

  useEffect(() => {
    const minute = 1000 * 60
    const intervalId = setInterval(() => {
      if (tokens?.refresh)
        getNewAccessToken()
    }, 4 * minute)

    return () => clearInterval(intervalId)
  }, [tokens?.refresh])

  const contextValue = {
    tokens,
    setTokens,
  }

  return <UserContext.Provider value={contextValue}>
    {children}
  </UserContext.Provider>
}

export function useUserContext() {
  const user = useContext(UserContext)
  if (!user) {
    throw new Error("useUserContext must be used within UserProvider");
  }
  return user
}

export type UserContextReturn = ReturnType<typeof useUserContext>