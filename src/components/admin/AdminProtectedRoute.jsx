import { Navigate, useLocation } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

export default function AdminProtectedRoute({ children }) {
  const { isAdminAuthenticated, isLoading } = useAdmin()
  const location = useLocation()

  console.log('AdminProtectedRoute:', { isAdminAuthenticated, isLoading })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-carbon-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-apex-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-carbon-400">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}