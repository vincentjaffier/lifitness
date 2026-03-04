import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Users, Building2, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight,
  UserPlus, CreditCard, Clock, AlertCircle, ChevronRight
} from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { cn } from '../../utils/helpers'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function AdminDashboard() {
  const { getStats, clubs, members, classes, contactRequests } = useAdmin()
  const stats = getStats()

  const statCards = [
    { label: 'Membres actifs', value: stats.activeMembers, total: stats.totalMembers, icon: Users, color: 'apex', change: '+12%', up: true },
    { label: 'Clubs', value: stats.clubsCount, icon: Building2, color: 'electric', change: '+1', up: true },
    { label: 'Cours actifs', value: stats.activeClasses, total: stats.totalClasses, icon: Calendar, color: 'success', change: '+5%', up: true },
    { label: 'Taux de remplissage', value: `${stats.fillRate}%`, icon: TrendingUp, color: 'warning', change: '-2%', up: false },
  ]

  const recentMembers = members.slice(0, 5)
  const pendingContacts = contactRequests.filter(c => c.status === 'new')
  const fullClasses = classes.filter(c => c.enrolled >= c.capacity)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-white mb-2">Dashboard</h1>
        <p className="text-carbon-400">Vue d'ensemble de l'activité APEX FITNESS</p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((stat, i) => (
          <motion.div key={i} variants={item} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                stat.color === 'apex' && 'bg-apex-500/10',
                stat.color === 'electric' && 'bg-electric-500/10',
                stat.color === 'success' && 'bg-success-500/10',
                stat.color === 'warning' && 'bg-warning-500/10'
              )}>
                <stat.icon className={cn(
                  'w-5 h-5',
                  stat.color === 'apex' && 'text-apex-400',
                  stat.color === 'electric' && 'text-electric-400',
                  stat.color === 'success' && 'text-success-400',
                  stat.color === 'warning' && 'text-warning-400'
                )} />
              </div>
              <span className={cn(
                'flex items-center gap-1 text-xs font-medium',
                stat.up ? 'text-success-400' : 'text-red-400'
              )}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <div className="font-display text-2xl text-white mb-1">
              {stat.value}
              {stat.total && <span className="text-carbon-500 text-base font-normal">/{stat.total}</span>}
            </div>
            <p className="text-sm text-carbon-400">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue Chart Placeholder */}
      <motion.div variants={item} initial="hidden" animate="show" className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg text-white">Revenus mensuels</h2>
          <select className="bg-carbon-800 border border-carbon-700 rounded-lg px-3 py-1.5 text-sm text-carbon-300">
            <option>6 derniers mois</option>
            <option>12 derniers mois</option>
            <option>Cette année</option>
          </select>
        </div>
        <div className="h-64 flex items-end justify-between gap-2">
          {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, i) => {
            const heights = [65, 72, 68, 85, 78, 92]
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-apex-500 to-apex-400 rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${heights[i]}%` }}
                />
                <span className="text-xs text-carbon-400">{month}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-carbon-800 flex items-center justify-between">
          <div>
            <p className="text-sm text-carbon-400">Total période</p>
            <p className="font-display text-xl text-white">{stats.totalRevenue.toLocaleString()}€</p>
          </div>
          <Link to="/admin/statistiques" className="text-apex-400 text-sm hover:underline flex items-center gap-1">
            Voir détails <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <motion.div variants={item} initial="hidden" animate="show" className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-white">Derniers inscrits</h2>
            <Link to="/admin/membres" className="text-apex-400 text-sm hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {recentMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-carbon-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-apex flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {member.firstName[0]}{member.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{member.firstName} {member.lastName}</p>
                    <p className="text-xs text-carbon-400">{member.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    member.subscription === 'elite' && 'bg-electric-500/20 text-electric-400',
                    member.subscription === 'premium' && 'bg-apex-500/20 text-apex-400',
                    member.subscription === 'essential' && 'bg-carbon-700 text-carbon-300'
                  )}>
                    {member.subscription}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts & Notifications */}
        <motion.div variants={item} initial="hidden" animate="show" className="card p-6">
          <h2 className="font-display text-lg text-white mb-4">Alertes & Notifications</h2>
          <div className="space-y-3">
            {pendingContacts.length > 0 && (
              <Link to="/admin/contacts" className="flex items-center gap-3 p-3 bg-apex-500/10 border border-apex-500/30 rounded-lg hover:bg-apex-500/20 transition-colors">
                <AlertCircle className="w-5 h-5 text-apex-400" />
                <div className="flex-1">
                  <p className="text-white font-medium">{pendingContacts.length} demande(s) de contact non traitée(s)</p>
                  <p className="text-xs text-carbon-400">Cliquez pour voir</p>
                </div>
                <ChevronRight className="w-4 h-4 text-carbon-400" />
              </Link>
            )}

            {fullClasses.length > 0 && (
              <Link to="/admin/cours" className="flex items-center gap-3 p-3 bg-warning-500/10 border border-warning-500/30 rounded-lg hover:bg-warning-500/20 transition-colors">
                <Clock className="w-5 h-5 text-warning-400" />
                <div className="flex-1">
                  <p className="text-white font-medium">{fullClasses.length} cours complet(s)</p>
                  <p className="text-xs text-carbon-400">Envisagez d'ajouter des créneaux</p>
                </div>
                <ChevronRight className="w-4 h-4 text-carbon-400" />
              </Link>
            )}

            <div className="flex items-center gap-3 p-3 bg-success-500/10 border border-success-500/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-success-400" />
              <div>
                <p className="text-white font-medium">Croissance +12% ce mois</p>
                <p className="text-xs text-carbon-400">Par rapport au mois précédent</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={item} initial="hidden" animate="show" className="card p-6">
        <h2 className="font-display text-lg text-white mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Ajouter un membre', icon: UserPlus, href: '/admin/membres?action=add' },
            { label: 'Créer un cours', icon: Calendar, href: '/admin/cours?action=add' },
            { label: 'Nouvelle promo', icon: CreditCard, href: '/admin/promotions?action=add' },
            { label: 'Voir les stats', icon: TrendingUp, href: '/admin/statistiques' },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="flex flex-col items-center gap-2 p-4 bg-carbon-800/30 rounded-xl hover:bg-carbon-800/50 transition-colors"
            >
              <action.icon className="w-6 h-6 text-apex-400" />
              <span className="text-sm text-carbon-300 text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
