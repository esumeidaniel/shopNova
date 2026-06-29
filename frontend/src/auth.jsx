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
    if (token.startsWith('demo-token-')) return

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

  const createDemoSession = ({ email, password, formData }) => {
    const safeEmail = (email || formData?.email || 'customer@shopnova.ng').trim().toLowerCase()

    if (!formData && password !== 'password123') {
      throw new Error('Invalid email or password')
    }

    const isAdminLogin = safeEmail === 'admin@shopnova.ng'
    const demoUser = {
      id: isAdminLogin ? 'demo_admin' : 'demo_customer',
      email: safeEmail,
      role: isAdminLogin ? 'admin' : 'customer',
      firstName: formData?.firstName || (isAdminLogin ? 'SHOPNOVA' : 'Demo'),
      lastName: formData?.lastName || (isAdminLogin ? 'Admin' : 'Customer'),
      phone: formData?.phone || '',
    }
    const session = {
      token: `demo-token-${demoUser.role}-${Date.now()}`,
      user: demoUser,
    }

    storeSession(session)
    setToken(session.token)
    setUser(session.user)
    return session.user
  }

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
      if (error.message === 'Failed to fetch') {
        return createDemoSession({ email, password })
      }

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
      if (error.message === 'Failed to fetch') {
        return createDemoSession({ formData })
      }

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
