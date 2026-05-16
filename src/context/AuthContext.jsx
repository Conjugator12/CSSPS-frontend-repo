import { createContext, useContext, useState, useEffect } from 'react'
import { loginStudent } from '../services/api'

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

  // Backend response shape: { access_token, token_type, student: { ... } }
  const login = async (index_number, date_of_birth) => {
    const { data } = await loginStudent(index_number, date_of_birth)
    const newToken = data.access_token
    const student  = data.student
    localStorage.setItem('cssps_token', newToken)
    localStorage.setItem('cssps_user', JSON.stringify(student))
    setToken(newToken)
    setUser(student)
    return student
  }

  const logout = () => clearAuth()

  const clearAuth = () => {
    localStorage.removeItem('cssps_token')
    localStorage.removeItem('cssps_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user, token, login, logout,
      isAuthenticated: Boolean(token && user),
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
