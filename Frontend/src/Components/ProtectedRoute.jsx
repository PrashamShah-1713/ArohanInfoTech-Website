import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext.jsx'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loadingAuth } = useContext(AuthContext)
  const location = useLocation()

  if (loadingAuth) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole) {
    const role = String(user.role || '').toLowerCase()
    const targetRole = String(requiredRole || '').toLowerCase()

    if (role !== targetRole) {
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default ProtectedRoute
