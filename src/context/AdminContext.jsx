import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Real data from Supabase
  const [members, setMembers] = useState([])
  const [coaches, setCoaches] = useState([])
  const [classes, setClasses] = useState([])
  const [supabaseStats, setSupabaseStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalClasses: 0,
    activeClasses: 0,
    fillRate: 0,
    totalRevenue: 0,
    clubsCount: 2,
    coachesCount: 0,
    newContactsCount: 0,
    activePromosCount: 0
  })

  // Mock data kept for non-connected features
  const [contactRequests] = useState([])
  const [promotions] = useState([])
  const [clubs] = useState([
    { id: 'lifitness-almadies', name: "LIF'ITNESS Almadies", city: 'Dakar', status: 'active', members: 0, revenue: 0 },
    { id: 'lifitness-sacre-coeur', name: "LIF'ITNESS Sacré Coeur", city: 'Dakar', status: 'active', members: 0, revenue: 0 },
  ])

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile?.role === 'admin') {
          setAdmin(profile)
          setIsAdminAuthenticated(true)
          await fetchDashboardData()
        }
      }
    } catch (error) {
      console.error('Erreur auth admin:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDashboardData = async () => {
    // Membres réels
    const { data: membersData } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'admin')
      .order('created_at', { ascending: false })

    if (membersData) {
      setMembers(membersData)
      setSupabaseStats(prev => ({
        ...prev,
        totalMembers: membersData.length,
        activeMembers: membersData.filter(m => m.subscription_status === 'active').length
      }))
    }

    // Coachs réels
    const { data: coachesData } = await supabase
      .from('coaches')
      .select('*')

    if (coachesData) {
      setCoaches(coachesData)
      setSupabaseStats(prev => ({
        ...prev,
        coachesCount: coachesData.length
      }))
    }

    // Cours réels
    const { data: coursesData } = await supabase
      .from('courses')
      .select('*, coaches(first_name, last_name)')

    if (coursesData) {
      setClasses(coursesData)
      setSupabaseStats(prev => ({
        ...prev,
        totalClasses: coursesData.length,
        activeClasses: coursesData.length
      }))
    }

    // Réservations du mois
    const firstDay = new Date()
    firstDay.setDate(1)
    const { count: bookingsCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed')
      .gte('date', firstDay.toISOString().split('T')[0])

    if (bookingsCount) {
      setSupabaseStats(prev => ({
        ...prev,
        fillRate: Math.min(Math.round((bookingsCount / (coursesData?.length * 30 * 30)) * 100), 100)
      }))
    }
  }

  const adminLogin = async (email, password) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profile?.role !== 'admin') {
        await supabase.auth.signOut()
        throw new Error('Accès non autorisé')
      }

      setAdmin(profile)
      setIsAdminAuthenticated(true)
      await fetchDashboardData()

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const adminLogout = async () => {
    await supabase.auth.signOut()
    setAdmin(null)
    setIsAdminAuthenticated(false)
  }

  // Stats combinées Supabase
  const getStats = () => supabaseStats

  // Coach Management
  const updateCoach = async (coachId, updates) => {
    const { error } = await supabase.from('coaches').update(updates).eq('id', coachId)
    if (!error) await fetchDashboardData()
    return { success: !error }
  }

  const addCoach = async (coachData) => {
    const { data, error } = await supabase.from('coaches').insert(coachData).select().single()
    if (!error) await fetchDashboardData()
    return { success: !error, coach: data }
  }

  const deleteCoach = async (coachId) => {
    const { error } = await supabase.from('coaches').delete().eq('id', coachId)
    if (!error) await fetchDashboardData()
    return { success: !error }
  }

  // Class Management
  const updateClass = async (classId, updates) => {
    const { error } = await supabase.from('courses').update(updates).eq('id', classId)
    if (!error) await fetchDashboardData()
    return { success: !error }
  }

  const addClass = async (classData) => {
    const { data, error } = await supabase.from('courses').insert(classData).select().single()
    if (!error) await fetchDashboardData()
    return { success: !error, class: data }
  }

  const deleteClass = async (classId) => {
    const { error } = await supabase.from('courses').delete().eq('id', classId)
    if (!error) await fetchDashboardData()
    return { success: !error }
  }

  // Member Management
  const updateMember = async (memberId, updates) => {
    const { error } = await supabase.from('profiles').update(updates).eq('id', memberId)
    if (!error) await fetchDashboardData()
    return { success: !error }
  }

  const suspendMember = async (memberId) => {
    return updateMember(memberId, { subscription_status: 'suspended' })
  }

  const activateMember = async (memberId) => {
    return updateMember(memberId, { subscription_status: 'active' })
  }

  // Mock functions kept for compatibility
  const updateClub = async () => ({ success: true })
  const addClub = async () => ({ success: true })
  const deleteClub = async () => ({ success: true })
  const updateContactRequest = async () => ({ success: true })
  const updatePromotion = async () => ({ success: true })
  const addPromotion = async () => ({ success: true })
  const deletePromotion = async () => ({ success: true })

  const value = {
    admin,
    isAdminAuthenticated,
    isLoading,
    adminLogin,
    adminLogout,
    clubs,
    coaches,
    classes,
    members,
    contactRequests,
    promotions,
    updateClub, addClub, deleteClub,
    updateCoach, addCoach, deleteCoach,
    updateClass, addClass, deleteClass,
    updateMember, suspendMember, activateMember,
    updateContactRequest,
    updatePromotion, addPromotion, deletePromotion,
    getStats,
    fetchDashboardData
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export default AdminContext