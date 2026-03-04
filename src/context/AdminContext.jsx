import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext(null)

// Mock admin users
const mockAdmins = [
  {
    id: 'admin-001',
    email: 'admin@apex-fitness.fr',
    password: 'admin123',
    firstName: 'Alexandre',
    lastName: 'Martin',
    role: 'super_admin',
    permissions: ['all'],
    avatar: null
  },
  {
    id: 'admin-002',
    email: 'manager@apex-fitness.fr',
    password: 'manager123',
    firstName: 'Sophie',
    lastName: 'Durand',
    role: 'manager',
    permissions: ['clubs', 'coaches', 'classes', 'members'],
    avatar: null
  }
]

// Mock data for admin management
const initialClubs = [
  { id: 'club-001', name: 'APEX Opéra', city: 'Paris', status: 'active', members: 1250, revenue: 87500 },
  { id: 'club-002', name: 'APEX Marais', city: 'Paris', status: 'active', members: 890, revenue: 62300 },
  { id: 'club-003', name: 'APEX Confluence', city: 'Lyon', status: 'active', members: 1100, revenue: 77000 },
  { id: 'club-004', name: 'APEX Chartrons', city: 'Bordeaux', status: 'active', members: 650, revenue: 45500 },
  { id: 'club-005', name: 'APEX Vieux-Port', city: 'Marseille', status: 'active', members: 920, revenue: 64400 },
  { id: 'club-006', name: 'APEX Promenade', city: 'Nice', status: 'active', members: 780, revenue: 54600 },
  { id: 'club-007', name: 'APEX Capitole', city: 'Toulouse', status: 'maintenance', members: 540, revenue: 37800 },
  { id: 'club-008', name: 'APEX Grand\'Place', city: 'Lille', status: 'active', members: 420, revenue: 29400 },
]

const initialCoaches = [
  { id: 'coach-001', firstName: 'Thomas', lastName: 'Kerrien', email: 'thomas.k@apex.fr', phone: '06 12 34 56 78', specialty: 'Musculation', clubs: ['club-001', 'club-002'], status: 'active', rating: 4.9, sessionsMonth: 45 },
  { id: 'coach-002', firstName: 'Sarah', lastName: 'Martinez', email: 'sarah.m@apex.fr', phone: '06 23 45 67 89', specialty: 'Cardio', clubs: ['club-001'], status: 'active', rating: 4.8, sessionsMonth: 52 },
  { id: 'coach-003', firstName: 'Marco', lastName: 'Vitali', email: 'marco.v@apex.fr', phone: '06 34 56 78 90', specialty: 'CrossFit', clubs: ['club-001', 'club-003'], status: 'active', rating: 4.9, sessionsMonth: 38 },
  { id: 'coach-004', firstName: 'Lisa', lastName: 'Patel', email: 'lisa.p@apex.fr', phone: '06 45 67 89 01', specialty: 'Yoga', clubs: ['club-002'], status: 'active', rating: 5.0, sessionsMonth: 40 },
  { id: 'coach-005', firstName: 'Karim', lastName: 'Benali', email: 'karim.b@apex.fr', phone: '06 56 78 90 12', specialty: 'Boxing', clubs: ['club-001', 'club-005'], status: 'active', rating: 4.7, sessionsMonth: 35 },
  { id: 'coach-006', firstName: 'Emma', lastName: 'Laurent', email: 'emma.l@apex.fr', phone: '06 67 89 01 23', specialty: 'Pilates', clubs: ['club-003', 'club-004'], status: 'vacation', rating: 4.8, sessionsMonth: 0 },
  { id: 'coach-007', firstName: 'Alex', lastName: 'Roux', email: 'alex.r@apex.fr', phone: '06 78 90 12 34', specialty: 'HYROX', clubs: ['club-001'], status: 'active', rating: 4.9, sessionsMonth: 28 },
]

const initialClasses = [
  { id: 'class-001', name: 'APEX BURN', activity: 'cardio', coach: 'coach-002', club: 'club-001', day: 'monday', time: '07:00', duration: 45, capacity: 20, enrolled: 18, status: 'active' },
  { id: 'class-002', name: 'POWER LIFT', activity: 'musculation', coach: 'coach-001', club: 'club-001', day: 'monday', time: '12:00', duration: 60, capacity: 15, enrolled: 15, status: 'active' },
  { id: 'class-003', name: 'APEX WOD', activity: 'crossfit', coach: 'coach-003', club: 'club-001', day: 'monday', time: '18:30', duration: 50, capacity: 12, enrolled: 12, status: 'active' },
  { id: 'class-004', name: 'FLOW YOGA', activity: 'yoga', coach: 'coach-004', club: 'club-002', day: 'tuesday', time: '09:00', duration: 60, capacity: 18, enrolled: 14, status: 'active' },
  { id: 'class-005', name: 'COMBAT FIT', activity: 'boxing', coach: 'coach-005', club: 'club-001', day: 'tuesday', time: '19:30', duration: 45, capacity: 16, enrolled: 10, status: 'active' },
  { id: 'class-006', name: 'HYROX PREP', activity: 'hyrox', coach: 'coach-007', club: 'club-001', day: 'wednesday', time: '18:00', duration: 75, capacity: 10, enrolled: 10, status: 'active' },
  { id: 'class-007', name: 'CORE BLAST', activity: 'cardio', coach: 'coach-002', club: 'club-001', day: 'wednesday', time: '12:30', duration: 30, capacity: 25, enrolled: 19, status: 'active' },
  { id: 'class-008', name: 'STRETCH & RELAX', activity: 'yoga', coach: 'coach-004', club: 'club-002', day: 'thursday', time: '20:00', duration: 45, capacity: 20, enrolled: 8, status: 'active' },
  { id: 'class-009', name: 'APEX BURN', activity: 'cardio', coach: 'coach-002', club: 'club-003', day: 'friday', time: '07:00', duration: 45, capacity: 20, enrolled: 16, status: 'active' },
  { id: 'class-010', name: 'POWER LIFT', activity: 'musculation', coach: 'coach-001', club: 'club-001', day: 'friday', time: '18:00', duration: 60, capacity: 15, enrolled: 13, status: 'cancelled' },
]

const initialMembers = [
  { id: 'member-001', firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@email.com', phone: '06 11 22 33 44', club: 'club-001', subscription: 'premium', status: 'active', joinDate: '2023-06-15', lastVisit: '2024-02-10', totalVisits: 127 },
  { id: 'member-002', firstName: 'Thomas', lastName: 'Martin', email: 'thomas.martin@email.com', phone: '06 22 33 44 55', club: 'club-003', subscription: 'elite', status: 'active', joinDate: '2021-03-20', lastVisit: '2024-02-11', totalVisits: 312 },
  { id: 'member-003', firstName: 'Sophie', lastName: 'Laurent', email: 'sophie.laurent@email.com', phone: '06 33 44 55 66', club: 'club-002', subscription: 'essential', status: 'active', joinDate: '2024-01-05', lastVisit: '2024-02-09', totalVisits: 15 },
  { id: 'member-004', firstName: 'Lucas', lastName: 'Bernard', email: 'lucas.bernard@email.com', phone: '06 44 55 66 77', club: 'club-001', subscription: 'premium', status: 'suspended', joinDate: '2022-09-10', lastVisit: '2024-01-15', totalVisits: 89 },
  { id: 'member-005', firstName: 'Emma', lastName: 'Petit', email: 'emma.petit@email.com', phone: '06 55 66 77 88', club: 'club-005', subscription: 'premium', status: 'active', joinDate: '2023-11-01', lastVisit: '2024-02-11', totalVisits: 42 },
  { id: 'member-006', firstName: 'Hugo', lastName: 'Moreau', email: 'hugo.moreau@email.com', phone: '06 66 77 88 99', club: 'club-004', subscription: 'essential', status: 'expired', joinDate: '2023-02-14', lastVisit: '2023-12-20', totalVisits: 67 },
  { id: 'member-007', firstName: 'Léa', lastName: 'Simon', email: 'lea.simon@email.com', phone: '06 77 88 99 00', club: 'club-001', subscription: 'elite', status: 'active', joinDate: '2022-05-30', lastVisit: '2024-02-10', totalVisits: 198 },
  { id: 'member-008', firstName: 'Nathan', lastName: 'Michel', email: 'nathan.michel@email.com', phone: '06 88 99 00 11', club: 'club-006', subscription: 'premium', status: 'active', joinDate: '2023-08-22', lastVisit: '2024-02-08', totalVisits: 56 },
]

const initialContactRequests = [
  { id: 'contact-001', name: 'Jean Dupuis', email: 'jean.dupuis@email.com', phone: '06 12 34 56 78', subject: 'Informations abonnement', message: 'Bonjour, je souhaite avoir des informations sur vos formules d\'abonnement...', date: '2024-02-11', status: 'new', assignedTo: null },
  { id: 'contact-002', name: 'Claire Martin', email: 'claire.m@email.com', phone: '06 23 45 67 89', subject: 'Partenariat entreprise', message: 'Notre société recherche un partenaire fitness pour nos employés...', date: '2024-02-10', status: 'in_progress', assignedTo: 'admin-002' },
  { id: 'contact-003', name: 'Pierre Leroy', email: 'p.leroy@email.com', phone: '06 34 56 78 90', subject: 'Coaching personnalisé', message: 'Je souhaite des informations sur vos programmes de coaching...', date: '2024-02-09', status: 'resolved', assignedTo: 'admin-001' },
  { id: 'contact-004', name: 'Marie Blanc', email: 'marie.blanc@email.com', phone: null, subject: 'Réclamation', message: 'Je n\'arrive pas à accéder à mon espace membre depuis 3 jours...', date: '2024-02-08', status: 'new', assignedTo: null },
]

const initialPromotions = [
  { id: 'promo-001', name: 'Offre Nouvel An', code: 'NEWYEAR24', discount: 50, type: 'percentage', validFrom: '2024-01-01', validTo: '2024-01-31', usageLimit: 500, usageCount: 342, status: 'expired', applicablePlans: ['essential', 'premium', 'elite'] },
  { id: 'promo-002', name: 'Premier mois offert', code: 'FIRSTMONTH', discount: 100, type: 'percentage', validFrom: '2024-02-01', validTo: '2024-02-29', usageLimit: 200, usageCount: 87, status: 'active', applicablePlans: ['essential', 'premium'] },
  { id: 'promo-003', name: 'Parrainage', code: 'PARRAIN50', discount: 50, type: 'fixed', validFrom: '2024-01-01', validTo: '2024-12-31', usageLimit: null, usageCount: 156, status: 'active', applicablePlans: ['essential', 'premium', 'elite'] },
  { id: 'promo-004', name: 'Été Fitness', code: 'SUMMER24', discount: 30, type: 'percentage', validFrom: '2024-06-01', validTo: '2024-08-31', usageLimit: 1000, usageCount: 0, status: 'scheduled', applicablePlans: ['premium', 'elite'] },
]

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Data states
  const [clubs, setClubs] = useState(initialClubs)
  const [coaches, setCoaches] = useState(initialCoaches)
  const [classes, setClasses] = useState(initialClasses)
  const [members, setMembers] = useState(initialMembers)
  const [contactRequests, setContactRequests] = useState(initialContactRequests)
  const [promotions, setPromotions] = useState(initialPromotions)

  // Check for existing admin session on mount
  useEffect(() => {
    const checkAdminAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      const savedSession = localStorage.getItem('apex_admin_session')
      if (savedSession) {
        const adminData = JSON.parse(savedSession)
        setAdmin(adminData)
        setIsAdminAuthenticated(true)
      }
      setIsLoading(false)
    }
    checkAdminAuth()
  }, [])

  // Admin Authentication
  const adminLogin = async (email, password) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      const foundAdmin = mockAdmins.find(a => a.email === email && a.password === password)
      if (foundAdmin) {
        const { password: _, ...adminData } = foundAdmin
        localStorage.setItem('apex_admin_session', JSON.stringify(adminData))
        setAdmin(adminData)
        setIsAdminAuthenticated(true)
        return { success: true }
      }
      throw new Error('Email ou mot de passe incorrect')
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const adminLogout = () => {
    localStorage.removeItem('apex_admin_session')
    setAdmin(null)
    setIsAdminAuthenticated(false)
  }

  // Club Management
  const updateClub = async (clubId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    setClubs(prev => prev.map(c => c.id === clubId ? { ...c, ...updates } : c))
    return { success: true }
  }

  const addClub = async (clubData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newClub = { ...clubData, id: `club-${Date.now()}`, members: 0, revenue: 0 }
    setClubs(prev => [...prev, newClub])
    return { success: true, club: newClub }
  }

  const deleteClub = async (clubId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    setClubs(prev => prev.filter(c => c.id !== clubId))
    return { success: true }
  }

  // Coach Management
  const updateCoach = async (coachId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    setCoaches(prev => prev.map(c => c.id === coachId ? { ...c, ...updates } : c))
    return { success: true }
  }

  const addCoach = async (coachData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newCoach = { ...coachData, id: `coach-${Date.now()}`, rating: 0, sessionsMonth: 0 }
    setCoaches(prev => [...prev, newCoach])
    return { success: true, coach: newCoach }
  }

  const deleteCoach = async (coachId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    setCoaches(prev => prev.filter(c => c.id !== coachId))
    return { success: true }
  }

  // Class Management
  const updateClass = async (classId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, ...updates } : c))
    return { success: true }
  }

  const addClass = async (classData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newClass = { ...classData, id: `class-${Date.now()}`, enrolled: 0 }
    setClasses(prev => [...prev, newClass])
    return { success: true, class: newClass }
  }

  const deleteClass = async (classId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    setClasses(prev => prev.filter(c => c.id !== classId))
    return { success: true }
  }

  // Member Management
  const updateMember = async (memberId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ...updates } : m))
    return { success: true }
  }

  const suspendMember = async (memberId) => {
    return updateMember(memberId, { status: 'suspended' })
  }

  const activateMember = async (memberId) => {
    return updateMember(memberId, { status: 'active' })
  }

  // Contact Management
  const updateContactRequest = async (contactId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    setContactRequests(prev => prev.map(c => c.id === contactId ? { ...c, ...updates } : c))
    return { success: true }
  }

  // Promotion Management
  const updatePromotion = async (promoId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    setPromotions(prev => prev.map(p => p.id === promoId ? { ...p, ...updates } : p))
    return { success: true }
  }

  const addPromotion = async (promoData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newPromo = { ...promoData, id: `promo-${Date.now()}`, usageCount: 0 }
    setPromotions(prev => [...prev, newPromo])
    return { success: true, promotion: newPromo }
  }

  const deletePromotion = async (promoId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    setPromotions(prev => prev.filter(p => p.id !== promoId))
    return { success: true }
  }

  // Statistics
  const getStats = () => {
    const totalMembers = members.length
    const activeMembers = members.filter(m => m.status === 'active').length
    const totalClasses = classes.length
    const activeClasses = classes.filter(c => c.status === 'active').length
    const totalEnrollments = classes.reduce((sum, c) => sum + c.enrolled, 0)
    const totalCapacity = classes.reduce((sum, c) => sum + c.capacity, 0)
    const fillRate = totalCapacity > 0 ? Math.round((totalEnrollments / totalCapacity) * 100) : 0
    const totalRevenue = clubs.reduce((sum, c) => sum + c.revenue, 0)
    const newContactsCount = contactRequests.filter(c => c.status === 'new').length
    const activePromosCount = promotions.filter(p => p.status === 'active').length

    return {
      totalMembers,
      activeMembers,
      totalClasses,
      activeClasses,
      totalEnrollments,
      totalCapacity,
      fillRate,
      totalRevenue,
      newContactsCount,
      activePromosCount,
      clubsCount: clubs.length,
      coachesCount: coaches.filter(c => c.status === 'active').length
    }
  }

  const value = {
    // Auth
    admin,
    isAdminAuthenticated,
    isLoading,
    adminLogin,
    adminLogout,
    
    // Data
    clubs,
    coaches,
    classes,
    members,
    contactRequests,
    promotions,
    
    // Club actions
    updateClub,
    addClub,
    deleteClub,
    
    // Coach actions
    updateCoach,
    addCoach,
    deleteCoach,
    
    // Class actions
    updateClass,
    addClass,
    deleteClass,
    
    // Member actions
    updateMember,
    suspendMember,
    activateMember,
    
    // Contact actions
    updateContactRequest,
    
    // Promotion actions
    updatePromotion,
    addPromotion,
    deletePromotion,
    
    // Stats
    getStats
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
