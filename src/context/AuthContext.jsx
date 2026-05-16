import { createContext, useContext, useState, useEffect } from 'react'
import { loginStudent, logoutStudent } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => localStorage.getItem('cssps_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('cssps_user')
    if (token && savedUser) {
      try { setUser(JSON.parse(savedUser)) }
      catch { clearAuth() }
    }
    setLoading(false)
  }, [])

  const login = async (index_number, pin) => {
    const { data } = await loginStudent(index_number, pin)
    const { token: newToken, student } = data
    localStorage.setItem('cssps_token', newToken)
    localStorage.setItem('cssps_user', JSON.stringify(student))
    setToken(newToken)
    setUser(student)
    return student
  }

  const logout = async () => {
    try { await logoutStudent() } catch { /* ignore */ }
    clearAuth()
  }

  const clearAuth = () => {
    localStorage.removeItem('cssps_token')
    localStorage.removeItem('cssps_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: Boolean(token && user), loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
