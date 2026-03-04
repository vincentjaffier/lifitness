import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import { AdminProvider } from './context/AdminContext'
import Layout from './components/layout/Layout'

// Public Pages
import Home from './pages/Home'
import Clubs from './pages/Clubs'
import ClubDetail from './pages/ClubDetail'
import Subscriptions from './pages/Subscriptions'
import Activities from './pages/Activities'
import Coaching from './pages/Coaching'
import Planning from './pages/Planning'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Register from './pages/Register'

// Member Pages
import Dashboard from './pages/member/Dashboard'
import MySubscription from './pages/member/MySubscription'
import MyReservations from './pages/member/MyReservations'
import MyProfile from './pages/member/MyProfile'
import MyInvoices from './pages/member/MyInvoices'

// Auth Pages
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

// Admin Pages
import AdminLayout from './components/admin/AdminLayout'
import AdminProtectedRoute from './components/admin/AdminProtectedRoute'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminClubs from './pages/admin/AdminClubs'
import AdminCoaches from './pages/admin/AdminCoaches'
import AdminClasses from './pages/admin/AdminClasses'
import AdminMembers from './pages/admin/AdminMembers'
import AdminContacts from './pages/admin/AdminContacts'
import AdminPromotions from './pages/admin/AdminPromotions'
import AdminStats from './pages/admin/AdminStats'

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AdminProvider>
          <Routes>
            {/* ================================
                PUBLIC ROUTES (Visiteurs)
                ================================ */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="clubs" element={<Clubs />} />
              <Route path="clubs/:slug" element={<ClubDetail />} />
              <Route path="abonnements" element={<Subscriptions />} />
              <Route path="activites" element={<Activities />} />
              <Route path="coaching" element={<Coaching />} />
              <Route path="planning" element={<Planning />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="contact" element={<Contact />} />
              <Route path="inscription" element={<Register />} />
              
              {/* Auth Routes */}
              <Route path="connexion" element={<Login />} />
              <Route path="creer-compte" element={<Signup />} />
              
              {/* ================================
                  MEMBER ROUTES (Abonnés)
                  ================================ */}
              <Route path="espace-membre">
                <Route index element={<Dashboard />} />
                <Route path="abonnement" element={<MySubscription />} />
                <Route path="reservations" element={<MyReservations />} />
                <Route path="profil" element={<MyProfile />} />
                <Route path="factures" element={<MyInvoices />} />
              </Route>
            </Route>

            {/* ================================
                ADMIN ROUTES (Administrateurs)
                ================================ */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="clubs" element={<AdminClubs />} />
              <Route path="coachs" element={<AdminCoaches />} />
              <Route path="cours" element={<AdminClasses />} />
              <Route path="membres" element={<AdminMembers />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="promotions" element={<AdminPromotions />} />
              <Route path="statistiques" element={<AdminStats />} />
            </Route>
          </Routes>
        </AdminProvider>
      </BookingProvider>
    </AuthProvider>
  )
}

export default App
