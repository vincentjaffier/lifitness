import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, Building2, Calendar, CreditCard, Activity, Target } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { cn } from '../../utils/helpers'

export default function AdminStats() {
  const { getStats, clubs, members, classes } = useAdmin()
  const stats = getStats()

  const kpis = [
    { label: 'Membres actifs', value: stats.activeMembers, total: stats.totalMembers, icon: Users, change: '+12%', up: true },
    { label: 'Revenus mensuels', value: `${(stats.totalRevenue/1000).toFixed(0)}K€`, icon: CreditCard, change: '+8%', up: true },
    { label: 'Taux de remplissage', value: `${stats.fillRate}%`, icon: Target, change: '-2%', up: false },
    { label: 'Cours actifs', value: stats.activeClasses, icon: Calendar, change: '+5', up: true },
  ]

  const subscriptionBreakdown = [
    { plan: 'Elite', count: members.filter(m => m.subscription === 'elite').length, color: 'bg-electric-500', revenue: 149.90 },
    { plan: 'Premium', count: members.filter(m => m.subscription === 'premium').length, color: 'bg-apex-500', revenue: 69.90 },
    { plan: 'Essential', count: members.filter(m => m.subscription === 'essential').length, color: 'bg-carbon-500', revenue: 39.90 },
  ]

  const clubStats = clubs.map(club => ({
    ...club,
    fillRate: Math.round(70 + Math.random() * 25)
  })).sort((a, b) => b.members - a.members)

  return (
    <div className="space-y-8">
      <div><h1 className="font-display text-2xl text-white mb-1">Statistiques</h1><p className="text-carbon-400">Vue d'ensemble des performances</p></div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-apex-500/10 flex items-center justify-center"><kpi.icon className="w-5 h-5 text-apex-400" /></div>
              <span className={cn('flex items-center gap-1 text-xs font-medium', kpi.up ? 'text-success-400' : 'text-red-400')}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{kpi.change}
              </span>
            </div>
            <div className="font-display text-2xl text-white mb-1">{kpi.value}{kpi.total && <span className="text-carbon-500 text-base font-normal">/{kpi.total}</span>}</div>
            <p className="text-sm text-carbon-400">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h2 className="font-display text-lg text-white mb-6">Évolution des revenus</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui'].map((month, i) => {
              const heights = [72, 68, 75, 82, 78, 88]
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gradient-to-t from-apex-600 to-apex-400 rounded-t-lg hover:opacity-80 transition-opacity cursor-pointer" style={{ height: `${heights[i]}%` }} />
                  <span className="text-xs text-carbon-400">{month}</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Subscription Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <h2 className="font-display text-lg text-white mb-6">Répartition abonnements</h2>
          <div className="space-y-4">
            {subscriptionBreakdown.map((sub) => {
              const percentage = Math.round((sub.count / stats.totalMembers) * 100)
              const monthlyRevenue = sub.count * sub.revenue
              return (
                <div key={sub.plan}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">{sub.plan}</span>
                    <span className="text-carbon-400">{sub.count} membres • {monthlyRevenue.toLocaleString()}€/mois</span>
                  </div>
                  <div className="w-full h-3 bg-carbon-800 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', sub.color)} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-carbon-800">
            <div className="flex justify-between"><span className="text-carbon-400">Revenus mensuels totaux</span><span className="font-display text-xl text-apex-400">{subscriptionBreakdown.reduce((sum, s) => sum + s.count * s.revenue, 0).toLocaleString()}€</span></div>
          </div>
        </motion.div>
      </div>

      {/* Club Performance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <h2 className="font-display text-lg text-white mb-6">Performance par club</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-carbon-800">
              <th className="text-left text-sm font-medium text-carbon-400 pb-4">Club</th>
              <th className="text-left text-sm font-medium text-carbon-400 pb-4">Membres</th>
              <th className="text-left text-sm font-medium text-carbon-400 pb-4">Revenus</th>
              <th className="text-left text-sm font-medium text-carbon-400 pb-4">Taux remplissage</th>
            </tr></thead>
            <tbody>
              {clubStats.map((club) => (
                <tr key={club.id} className="border-b border-carbon-800/50">
                  <td className="py-4"><div className="flex items-center gap-3"><Building2 className="w-5 h-5 text-apex-400" /><div><p className="font-medium text-white">{club.name}</p><p className="text-xs text-carbon-400">{club.city}</p></div></div></td>
                  <td className="py-4 text-carbon-300">{club.members.toLocaleString()}</td>
                  <td className="py-4 text-white font-medium">{club.revenue.toLocaleString()}€</td>
                  <td className="py-4"><div className="flex items-center gap-3"><div className="w-24 h-2 bg-carbon-800 rounded-full"><div className={cn('h-full rounded-full', club.fillRate >= 85 ? 'bg-success-500' : club.fillRate >= 70 ? 'bg-apex-500' : 'bg-warning-500')} style={{ width: `${club.fillRate}%` }} /></div><span className="text-sm text-carbon-300">{club.fillRate}%</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Activity Distribution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
        <h2 className="font-display text-lg text-white mb-6">Activités les plus populaires</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Cardio', count: 45, color: 'text-red-400' },
            { name: 'Musculation', count: 38, color: 'text-apex-400' },
            { name: 'CrossFit', count: 32, color: 'text-warning-400' },
            { name: 'Yoga', count: 28, color: 'text-success-400' },
            { name: 'Boxing', count: 22, color: 'text-electric-400' },
            { name: 'HYROX', count: 15, color: 'text-purple-400' },
          ].map((activity) => (
            <div key={activity.name} className="text-center p-4 bg-carbon-800/30 rounded-xl">
              <Activity className={cn('w-8 h-8 mx-auto mb-2', activity.color)} />
              <p className="font-display text-xl text-white">{activity.count}</p>
              <p className="text-xs text-carbon-400">{activity.name}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
