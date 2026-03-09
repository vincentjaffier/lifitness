import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, Building2, Calendar, CreditCard, Activity, Target } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { supabase } from '../../lib/supabase'
import { cn } from '../../utils/helpers'

const PLAN_PRICES = {
  essential: 19900,
  premium: 34900,
  elite: 74900
}

export default function AdminStats() {
  const { members, courses } = useAdmin()
  const [payments, setPayments] = useState([])

  useEffect(() => {
    supabase
      .from('payments')
      .select('*')
      .eq('status', 'confirmed')
      .then(({ data }) => setPayments(data || []))
  }, [])

  const activeMembers = members.filter(m => m.subscription_status === 'active').length
  const totalMembers = members.length

  // Revenus mensuels = somme des abonnements actifs
  const monthlyRevenue = members
    .filter(m => m.subscription_status === 'active')
    .reduce((sum, m) => sum + (PLAN_PRICES[m.subscription_type] || 0), 0)

  // Répartition abonnements
  const subscriptionBreakdown = [
    { plan: 'Elite', key: 'elite', color: 'bg-electric-500' },
    { plan: 'Premium', key: 'premium', color: 'bg-apex-500' },
    { plan: 'Essential', key: 'essential', color: 'bg-carbon-500' },
  ].map(s => ({
    ...s,
    count: members.filter(m => m.subscription_type === s.key).length,
    revenue: members.filter(m => m.subscription_type === s.key && m.subscription_status === 'active').length * PLAN_PRICES[s.key]
  }))

  // Taux de remplissage = réservations / (cours * places max)
  const totalSpots = (courses?.length || 0) * 30
  const fillRate = totalSpots > 0 ? Math.round((payments.length / totalSpots) * 100) : 0

  const kpis = [
    { label: 'Membres actifs', value: activeMembers, total: totalMembers, icon: Users, change: `${activeMembers}/${totalMembers}`, up: true },
    { label: 'Revenus mensuels', value: `${(monthlyRevenue / 1000).toFixed(0)}K FCFA`, icon: CreditCard, change: '+0%', up: true },
    { label: 'Taux de remplissage', value: `${fillRate}%`, icon: Target, change: `${fillRate}%`, up: fillRate > 50 },
    { label: 'Cours actifs', value: courses?.length || 0, icon: Calendar, change: `${courses?.length || 0} cours`, up: true },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-white mb-1">Statistiques</h1>
        <p className="text-carbon-400">Vue d'ensemble des performances</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-apex-500/10 flex items-center justify-center">
                <kpi.icon className="w-5 h-5 text-apex-400" />
              </div>
              <span className={cn('flex items-center gap-1 text-xs font-medium', kpi.up ? 'text-success-400' : 'text-red-400')}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <div className="font-display text-2xl text-white mb-1">
              {kpi.value}
              {kpi.total !== undefined && <span className="text-carbon-500 text-base font-normal">/{kpi.total}</span>}
            </div>
            <p className="text-sm text-carbon-400">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Répartition abonnements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <h2 className="font-display text-lg text-white mb-6">Répartition abonnements</h2>
          <div className="space-y-4">
            {subscriptionBreakdown.map((sub) => {
              const percentage = totalMembers > 0 ? Math.round((sub.count / totalMembers) * 100) : 0
              return (
                <div key={sub.plan}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">{sub.plan}</span>
                    <span className="text-carbon-400">{sub.count} membres • {sub.revenue.toLocaleString('fr-FR')} FCFA/mois</span>
                  </div>
                  <div className="w-full h-3 bg-carbon-800 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', sub.color)} style={{ width: `${percentage || 0}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-carbon-800">
            <div className="flex justify-between">
              <span className="text-carbon-400">Revenus mensuels totaux</span>
              <span className="font-display text-xl text-apex-400">{monthlyRevenue.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
        </motion.div>

        {/* Paiements confirmés */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
          <h2 className="font-display text-lg text-white mb-6">Paiements récents confirmés</h2>
          {payments.length === 0 ? (
            <p className="text-carbon-400 text-center py-8">Aucun paiement confirmé</p>
          ) : (
            <div className="space-y-3">
              {payments.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-carbon-800/30 rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium capitalize">{p.subscription_type}</p>
                    <p className="text-carbon-400 text-xs">{p.payment_method === 'wave' ? '🌊 Wave' : '🟠 Orange Money'} • {new Date(p.confirmed_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <span className="text-success-400 font-medium text-sm">{PLAN_PRICES[p.subscription_type]?.toLocaleString('fr-FR')} FCFA</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Cours actifs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
        <h2 className="font-display text-lg text-white mb-6">Cours actifs</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(courses || []).map((course) => (
            <div key={course.id} className="text-center p-4 bg-carbon-800/30 rounded-xl">
              <Activity className="w-8 h-8 mx-auto mb-2 text-apex-400" />
              <p className="font-medium text-white text-sm">{course.name}</p>
              <p className="text-xs text-carbon-400 mt-1">
                {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'][course.day_of_week - 1]} {course.start_time?.slice(0, 5)}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}