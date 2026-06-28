import { useEffect, useState } from 'react'
import { api, clearSession, getStoredToken, getStoredUser, storeSession } from './api'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken())
  const [user, setUser] = useState(() => getStoredUser())
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const isLoggedIn = Boolean(token && user)
  const userEmail = user?.email || ''

  useEffect(() => {
    if (!token) return

    api.me()
      .then(({ user }) => {
        setUser(user)
        storeSession({ token, user })
      })
      .catch(() => {
        clearSession()
        setToken('')
        setUser(null)
      })
  }, [token])

  const login = async (email = 'customer@shopnova.ng', password = 'password123') => {
    setAuthLoading(true)
    setAuthError('')

    try {
      const session = await api.login({ email, password })
      storeSession(session)
      setToken(session.token)
      setUser(session.user)
      return session.user
    } catch (error) {
      setAuthError(error.message)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  const register = async (formData) => {
    setAuthLoading(true)
    setAuthError('')

    try {
      const session = await api.register(formData)
      storeSession(session)
      setToken(session.token)
      setUser(session.user)
      return session.user
    } catch (error) {
      setAuthError(error.message)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = () => {
    clearSession()
    setToken('')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ authError, authLoading, isLoggedIn, isAdmin: user?.role === 'admin', token, user, userEmail, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
