import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchAndSetUser(session.user)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchAndSetUser(session.user)
    
          // Si c'est une première connexion et qu'une photo est en attente
          if (event === 'SIGNED_IN') {
            const pendingAvatar = localStorage.getItem('pending_avatar')
            if (pendingAvatar) {
              // Convertir le base64 en fichier
              const res = await fetch(pendingAvatar)
              const blob = await res.blob()
              const fileName = `${session.user.id}.jpg`
    
              const { error } = await supabase.storage
                .from('avatars')
                .upload(fileName, blob, { upsert: true })
    
              if (!error) {
                const { data: { publicUrl } } = supabase.storage
                  .from('avatars')
                  .getPublicUrl(fileName)
    
                await supabase
                  .from('profiles')
                  .update({ avatar_url: publicUrl })
                  .eq('id', session.user.id)
    
                // Nettoyer le localStorage
                localStorage.removeItem('pending_avatar')
    
                // Resynchroniser le contexte avec la nouvelle photo
                await fetchAndSetUser(session.user)
              }
            }
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchAndSetUser = async (sessionUser) => {
    const base = {
      id: sessionUser.id,
      email: sessionUser.email,
      first_name: sessionUser.user_metadata?.first_name || '',
      last_name: sessionUser.user_metadata?.last_name || '',
      phone: sessionUser.user_metadata?.phone || '',
      avatar_url: null,
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, phone, avatar_url')
      .eq('id', sessionUser.id)
      .single()

    setUser({ ...base, ...(profile ?? {}) })
  }

  const refreshUser = async () => {
    const { data: { user: sessionUser } } = await supabase.auth.getUser()
    if (sessionUser) await fetchAndSetUser(sessionUser)
  }

  const signUp = async (email, password, firstName, lastName, phone) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
          }
        }
      })
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUser,
    login: signIn,
    logout: signOut,
    register: signUp,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}