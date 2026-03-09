import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, Building2, Users, Calendar, UserCircle, 
  Mail, Tag, BarChart3, LogOut, Menu, X,
  Bell, Search, CreditCard
} from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { cn } from '../../utils/helpers'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Clubs', href: '/admin/clubs', icon: Building2 },
  { name: 'Coachs', href: '/admin/coachs', icon: Users },
  { name: 'Cours', href: '/admin/cours', icon: Calendar },
  { name: 'Membres', href: '/admin/membres', icon: UserCircle },
  { name: 'Paiements', href: '/admin/paiements', icon: CreditCard, badge: 'pendingPayments' },
  { name: 'Contacts', href: '/admin/contacts', icon: Mail },
  { name: 'Promotions', href: '/admin/promotions', icon: Tag },
  { name: 'Statistiques', href: '/admin/statistiques', icon: BarChart3 },
]

export default function AdminLayout() {
  const { admin, adminLogout, getStats } = useAdmin()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const stats = getStats()

  const handleLogout = () => {
    adminLogout()
    navigate('/admin/login')
  }

  const getBadge = (badgeKey) => {
    if (badgeKey === 'pendingPayments') return stats.pendingPayments || 0
    if (badgeKey === 'newContacts') return stats.newContactsCount || 0
    return 0
  }

  const SidebarNav = ({ onClose }) => (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navigation.map((item) => {
        const badgeCount = item.badge ? getBadge(item.badge) : 0
        return (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-apex-500/10 text-apex-400'
                  : 'text-carbon-400 hover:text-white hover:bg-carbon-800/50'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
            {badgeCount > 0 && (
              <span className="ml-auto bg-apex-500 text-white text-xs px-2 py-0.5 rounded-full">
                {badgeCount}
              </span>
            )}
          </NavLink>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-carbon-950 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-carbon-900 border-r border-carbon-800">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-carbon-800">
          <img src="/logo.png" alt="Lif'itness" className="w-10 h-10 object-contain" />
          <div>
            <span className="font-display font-bold text-white">LIF'ITNESS</span>
            <span className="text-xs text-apex-400 ml-1">Admin</span>
          </div>
        </div>

        <SidebarNav onClose={undefined} />

        <div className="p-4 border-t border-carbon-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-apex flex items-center justify-center">
              <span className="font-bold text-white text-sm">
                {admin?.first_name?.[0]}{admin?.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {admin?.first_name} {admin?.last_name}
              </p>
              <p className="text-xs text-carbon-400 truncate">{admin?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-carbon-400 hover:text-white hover:bg-carbon-800/50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-carbon-950/80" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-carbon-900 border-r border-carbon-800 flex flex-col">
            <div className="h-16 flex items-center justify-between px-6 border-b border-carbon-800">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Lif'itness" className="w-10 h-10 object-contain" />
                <span className="font-display font-bold text-white">LIF'ITNESS Admin</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-carbon-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarNav onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64 flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-carbon-800 bg-carbon-900/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-carbon-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-carbon-500" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-64 pl-10 pr-4 py-2 bg-carbon-800/50 border border-carbon-700 rounded-lg text-sm text-white placeholder-carbon-500 focus:outline-none focus:border-apex-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-carbon-400 hover:text-white">
              <Bell className="w-5 h-5" />
              {(stats.newContactsCount > 0 || stats.pendingPayments > 0) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-apex-500 rounded-full" />
              )}
            </button>
            <Link to="/" target="_blank" className="text-sm text-carbon-400 hover:text-apex-400">
              Voir le site →
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}