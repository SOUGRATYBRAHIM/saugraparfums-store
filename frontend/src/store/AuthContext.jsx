import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin]     = useState(null)
  const [loading, setLoading] = useState(true) // checking cookie on load

  // On every page refresh — check if cookie is still valid
  useEffect(() => {
    authService.me()
      .then(res => setAdmin(res.data.user))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await authService.login(email, password)
    setAdmin(res.data.user) // cookie set by server automatically
  }

  const logout = async () => {
    await authService.logout()
    setAdmin(null) // cookie deleted by server
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
