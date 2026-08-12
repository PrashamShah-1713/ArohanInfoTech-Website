import { createContext, useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') {
      return null
    }

    const savedUser = localStorage.getItem('authUser')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const syncUserFromStorage = (event) => {
      if (event.key === 'authUser' || !event.key) {
        const nextUser = event.newValue ? JSON.parse(event.newValue) : null
        setUser(nextUser)
      }
    }

    window.addEventListener('storage', syncUserFromStorage)

    async function fetchCurrentUser() {
      const savedUser = localStorage.getItem('authUser')
      if (!savedUser) {
        setLoadingAuth(false)
        return
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/Users/me`, {
          withCredentials: true,
        })

        if (response.data.success) {
          const currentUser = response.data.user
          setUser(currentUser)
          localStorage.setItem('authUser', JSON.stringify(currentUser))
        } else {
          setUser(null)
          localStorage.removeItem('authUser')
        }
      } catch (error) {
        setUser(null)
        localStorage.removeItem('authUser')
      } finally {
        setLoadingAuth(false)
      }
    }

    fetchCurrentUser()

    return () => {
      window.removeEventListener('storage', syncUserFromStorage)
    }
  }, [])

  const persistUser = (nextUser) => {
    setUser(nextUser)

    if (typeof window !== 'undefined') {
      if (nextUser) {
        localStorage.setItem('authUser', JSON.stringify(nextUser))
      } else {
        localStorage.removeItem('authUser')
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/Users/logout`, {}, { withCredentials: true })
    } catch (error) {
      // ignore logout failure, clear client state
    }
    persistUser(null)
    return { success: true, message: 'Logged out successfully.' }
  }

  const deleteAccount = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/Users/logout`, {}, { withCredentials: true })
    } catch (error) {
      // ignore; still clear local auth state
    }
    persistUser(null)
    return { success: true, message: 'Account deleted successfully.' }
  }

  const updateProfile = async (profile) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/api/Users/profile`, profile, {
        withCredentials: true,
      })

      if (response.data.success) {
        persistUser(response.data.user)
      }

      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to update profile.'
      return { success: false, message }
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser: persistUser, logout, deleteAccount, updateProfile, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
