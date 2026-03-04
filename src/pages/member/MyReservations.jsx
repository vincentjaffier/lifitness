import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, MapPin, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'
import Section from '../../components/ui/Section'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

export default function MyReservations() {
  const { isAuthenticated } = useAuth()
  const { reservations, cancelReservation, isLoading } = useBooking()
  const [activeTab, setActiveTab] = useState('upcoming')

  if (!isAuthenticated) return <Section><div className="container-custom text-center"><Link to="/connexion" className="btn-primary">Se connecter</Link></div></Section>

  const today = new Date().toISOString().split('T')[0]
  const upcoming = reservations.filter(r => r.date >= today && r.status === 'confirmed')
  const past = reservations.filter(r => r.date < today || r.status === 'cancelled')

  const handleCancel = async (id) => {
    if (window.confirm('Annuler cette réservation ?')) {
      await cancelReservation(id)
    }
  }

  const displayList = activeTab === 'upcoming' ? upcoming : past

  return (
    <Section size="sm">
      <div className="container-custom max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-display-sm text-white">Mes réservations</h1>
          <Link to="/planning" className="btn-primary btn-sm">Réserver un cours</Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('upcoming')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'upcoming' ? 'bg-apex-500 text-white' : 'bg-carbon-800 text-carbon-400'}`}>
            À venir ({upcoming.length})
          </button>
          <button onClick={() => setActiveTab('past')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'past' ? 'bg-apex-500 text-white' : 'bg-carbon-800 text-carbon-400'}`}>
            Historique ({past.length})
          </button>
        </div>

        {/* List */}
        {displayList.length > 0 ? (
          <div className="space-y-4">
            {displayList.map((res, i) => (
              <motion.div key={res.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display text-lg text-white">{res.className}</h3>
                      <Badge variant={res.status === 'confirmed' ? 'success' : 'neutral'}>
                        {res.status === 'confirmed' ? 'Confirmé' : 'Annulé'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-carbon-400">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{res.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{res.time} ({res.duration}min)</span>
                      <span className="flex items-center gap-1"><User className="w-4 h-4" />{res.instructor}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{res.clubName}</span>
                    </div>
                  </div>
                  {res.status === 'confirmed' && activeTab === 'upcoming' && (
                    <button onClick={() => handleCancel(res.id)} disabled={isLoading} className="btn-ghost text-red-400 btn-sm">
                      <X className="w-4 h-4" /> Annuler
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <Calendar className="w-12 h-12 text-carbon-600 mx-auto mb-4" />
            <p className="text-carbon-400">
              {activeTab === 'upcoming' ? 'Aucune réservation à venir' : 'Aucun historique'}
            </p>
          </div>
        )}
      </div>
    </Section>
  )
}
