import { Navigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'

/**
 * Wrap admin pages with this.
 * If cookie is missing/expired → redirect to /admin/login
 */
export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!admin) return <Navigate to="/admin/login" replace />

  return children
}
