import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, CreditCard, User, FileText, Clock, Dumbbell, ArrowRight, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'
import Section from '../../components/ui/Section'
import Badge from '../../components/ui/Badge'
import QRCodeCard from '../../components/member/QRCodeCard'

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  const { getActiveReservations, reservations } = useBooking()

  if (loading) {
    return (
      <Section>
        <div className="container-custom text-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-apex-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-carbon-400 mt-4">Chargement...</p>
        </div>
      </Section>
    )
  }

  if (!isAuthenticated) {
    return (
      <Section>
        <div className="container-custom text-center">
          <h1 className="font-display text-2xl text-white mb-4">Connectez-vous</h1>
          <Link to="/connexion" className="btn-primary">Se connecter</Link>
        </div>
      </Section>
    )
  }

  const activeReservations = getActiveReservations()

  // Stats réelles
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const seancesThisMonth = reservations.filter(r => r.status === 'confirmed' && r.date >= firstDayOfMonth).length
  const totalSeances = reservations.filter(r => r.status === 'confirmed').length

  const subscriptionStatus = user?.subscription_status
  const subscriptionType = user?.subscription_type

  const quickLinks = [
    { icon: Calendar, label: 'Mes réservations', href: '/espace-membre/reservations', count: activeReservations.length },
    { icon: CreditCard, label: 'Mon abonnement', href: '/espace-membre/abonnement' },
    { icon: FileText, label: 'Mes factures', href: '/espace-membre/factures' },
    { icon: User, label: 'Mon profil', href: '/espace-membre/profil' },
  ]

  return (
    <Section size="sm">
      <div className="container-custom">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-display-sm text-white mb-2">
            Bonjour, {user?.first_name || user?.email} 👋
          </h1>
          <p className="text-carbon-400">Bienvenue dans votre espace membre LIF'ITNESS</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Séances ce mois', value: seancesThisMonth, icon: Dumbbell },
            { label: 'Réservations à venir', value: activeReservations.length, icon: Clock },
            { label: 'Total séances', value: totalSeances, icon: Calendar },
            { label: 'Statut abonnement', value: subscriptionStatus === 'active' ? '✓ Actif' : '⚠ Inactif', icon: CreditCard },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} className="card p-4">
              <stat.icon className="w-5 h-5 text-apex-400 mb-2" />
              <div className="font-display text-2xl text-white">{stat.value}</div>
              <div className="text-sm text-carbon-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-display text-xl text-white mb-4">Accès rapide</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickLinks.map((link, i) => (
                <Link key={i} to={link.href} className="card-interactive p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-apex-500/10 flex items-center justify-center">
                      <link.icon className="w-5 h-5 text-apex-400" />
                    </div>
                    <span className="font-medium text-white">{link.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {link.count !== undefined && link.count > 0 && <Badge variant="apex">{link.count}</Badge>}
                    <ChevronRight className="w-4 h-4 text-carbon-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* QR Code Card */}
          <QRCodeCard user={user} />
        </div>

        {/* Subscription Card */}
        <div className="mt-6">
          <div className="card p-6">
            <h2 className="font-display text-lg text-white mb-4">Mon abonnement</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {subscriptionType ? (
                  <Badge variant="apex">{subscriptionType.toUpperCase()}</Badge>
                ) : (
                  <Badge variant="neutral">AUCUN</Badge>
                )}
                <span className={subscriptionStatus === 'active' ? 'text-success-400 text-sm' : 'text-warning-400 text-sm'}>
                  {subscriptionStatus === 'active' ? '✓ Actif' : subscriptionStatus === 'pending' ? '⏳ En attente' : '⚠ Inactif'}
                </span>
              </div>
              <Link to="/espace-membre/abonnement" className="btn-secondary justify-center">
                Gérer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}