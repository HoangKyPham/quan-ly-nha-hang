'use client'
import { createContext, useContext, useLayoutEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccountQuery } from '@/queries/useAccount'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
})
const AppContext = createContext<{
  isAuth: boolean
  setIsAuth: (value: boolean) => void
}>({
  isAuth: false,
  setIsAuth: (value: boolean) => {}
})

export const useAppContext = () => {
  const context = useContext(AppContext)
  return context
}

function Provider({ children }: { children: React.ReactNode }) {
  //lazy initialization
  const [isAuth, setIsAuth] = useState(() => {
    if (typeof window === 'undefined') return false
    return Boolean(localStorage.getItem('accessToken'))
  })
  useAccountQuery({
    enabled: isAuth
  })
  return <AppContext.Provider value={{ isAuth, setIsAuth }}>{children}</AppContext.Provider>
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>{children}</Provider>
    </QueryClientProvider>
  )
}
