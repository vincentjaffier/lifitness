import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, CreditCard, User, FileText, Clock, Dumbbell, ArrowRight, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'
import Section from '../../components/ui/Section'
import Badge from '../../components/ui/Badge'

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const { getActiveReservations } = useBooking()

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
            Bonjour, {user?.firstName} 👋
          </h1>
          <p className="text-carbon-400">Bienvenue dans votre espace membre APEX</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Séances ce mois', value: user?.stats?.thisMonth || 0, icon: Dumbbell },
            { label: 'Série en cours', value: `${user?.stats?.streak || 0} jours`, icon: Clock },
            { label: 'Total séances', value: user?.stats?.totalWorkouts || 0, icon: Calendar },
            { label: 'Réservations', value: activeReservations.length, icon: Calendar },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-4">
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
                    {link.count !== undefined && <Badge variant="apex">{link.count}</Badge>}
                    <ChevronRight className="w-4 h-4 text-carbon-400" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Next Reservations */}
            {activeReservations.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-xl text-white mb-4">Prochaines réservations</h2>
                <div className="space-y-3">
                  {activeReservations.slice(0, 3).map((res, i) => (
                    <div key={i} className="card p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{res.className}</div>
                        <div className="text-sm text-carbon-400">{res.date} à {res.time}</div>
                      </div>
                      <Badge variant="success">Confirmé</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Subscription Card */}
          <div className="card p-6">
            <h2 className="font-display text-lg text-white mb-4">Mon abonnement</h2>
            {user?.subscription ? (
              <>
                <Badge variant="apex" className="mb-3">{user.subscription.plan.toUpperCase()}</Badge>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-carbon-400">Statut</span>
                    <span className="text-success-400">Actif</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-carbon-400">Tarif</span>
                    <span className="text-white">{user.subscription.price}€/mois</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-carbon-400">Prochain prélèvement</span>
                    <span className="text-white">{user.subscription.nextBilling}</span>
                  </div>
                </div>
                <Link to="/espace-membre/abonnement" className="btn-secondary w-full justify-center mt-4">
                  Gérer <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-carbon-400 mb-4">Aucun abonnement actif</p>
                <Link to="/abonnements" className="btn-primary">Voir les offres</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}
