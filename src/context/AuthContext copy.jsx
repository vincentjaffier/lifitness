import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Mock user data
const mockUser = {
  id: 'user-001',
  email: 'marie.dupont@email.com',
  firstName: 'Marie',
  lastName: 'Dupont',
  phone: '+33 6 12 34 56 78',
  avatar: null,
  subscription: {
    id: 'sub-001',
    plan: 'premium',
    status: 'active',
    startDate: '2023-06-15',
    nextBilling: '2024-02-15',
    price: 69.90,
    club: 'apex-paris-opera'
  },
  stats: {
    totalWorkouts: 127,
    thisMonth: 12,
    streak: 8,
    favoriteActivity: 'musculation'
  },
  preferences: {
    notifications: true,
    newsletter: true,
    language: 'fr'
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Simulate checking auth status
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Check localStorage for session
      const savedSession = localStorage.getItem('apex_session')
      if (savedSession) {
        setUser(mockUser)
        setIsAuthenticated(true)
      }
      
      setIsLoading(false)
    }
    
    checkAuth()
  }, [])

  const login = async (email, password) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock validation
      if (email && password) {
        localStorage.setItem('apex_session', 'mock-session-token')
        setUser(mockUser)
        setIsAuthenticated(true)
        return { success: true }
      }
      
      throw new Error('Email ou mot de passe incorrect')
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newUser = {
        ...mockUser,
        id: `user-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        subscription: null
      }
      
      localStorage.setItem('apex_session', 'mock-session-token')
      setUser(newUser)
      setIsAuthenticated(true)
      
      return { success: true, user: newUser }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('apex_session')
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateProfile = async (updates) => {
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUser(prev => ({
        ...prev,
        ...updates
      }))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
