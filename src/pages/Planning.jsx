import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, User, Users, CheckCircle, XCircle } from 'lucide-react'
import Section, { SectionHeader } from '../components/ui/Section'
import { useBooking } from '../context/BookingContext'
import { useAuth } from '../context/AuthContext'

export default function Planning() {
  const { schedule, bookClass, isLoading } = useBooking()
  const { isAuthenticated } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedActivity, setSelectedActivity] = useState('')
  const [toast, setToast] = useState(null) // { message, type: 'success' | 'error' }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const dates = useMemo(() => {
    const arr = []
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      arr.push({ date: d.toISOString().split('T')[0], label: d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }) })
    }
    return arr
  }, [])

  const filteredSchedule = useMemo(() => {
    return schedule.filter(c => c.date === selectedDate && (!selectedActivity || c.activity === selectedActivity))
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [schedule, selectedDate, selectedActivity])

  const activities = [...new Set(schedule.map(c => c.activity))]

  const handleBook = async (classItem) => {
    if (!isAuthenticated) {
      showToast('Connectez-vous pour réserver', 'error')
      return
    }
    const result = await bookClass(classItem)
    if (result.success) showToast('Réservation confirmée ! 🎉', 'success')
    else showToast(result.error, 'error')
  }

  return (
    <>
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl ${toast.type === 'success' ? 'bg-success-500 text-white' : 'bg-red-500 text-white'}`}
          >
            {toast.type === 'success'
              ? <CheckCircle className="w-5 h-5 shrink-0" />
              : <XCircle className="w-5 h-5 shrink-0" />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="py-12 bg-carbon-900/50">
        <div className="container-custom">
          <SectionHeader badge="Planning" title="Réservez vos cours" />

          {/* Date selector */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {dates.map(d => (
              <button
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                className={`px-4 py-3 rounded-xl whitespace-nowrap transition-all ${selectedDate === d.date ? 'bg-apex-500 text-white' : 'bg-carbon-800 text-carbon-300 hover:bg-carbon-700'}`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Activity filter */}
          <div className="flex gap-2 flex-wrap mb-8">
            <button onClick={() => setSelectedActivity('')} className={`px-3 py-1.5 rounded-full text-sm ${!selectedActivity ? 'bg-apex-500 text-white' : 'bg-carbon-800 text-carbon-400'}`}>
              Tous
            </button>
            {activities.map(a => (
              <button key={a} onClick={() => setSelectedActivity(a)} className={`px-3 py-1.5 rounded-full text-sm capitalize ${selectedActivity === a ? 'bg-apex-500 text-white' : 'bg-carbon-800 text-carbon-400'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Section size="sm">
        <div className="container-custom">
          {filteredSchedule.length > 0 ? (
            <div className="space-y-4">
              {filteredSchedule.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="card p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{c.time.replace(':', 'h')}</div>
                      <div className="text-xs text-carbon-400">{c.duration}min</div>
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-white">{c.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-carbon-400">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{c.instructor}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.available} places</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBook(c)}
                    disabled={isLoading || c.available === 0}
                    className={c.available > 0 ? 'btn-primary btn-sm' : 'btn-secondary btn-sm opacity-50'}
                  >
                    {c.available > 0 ? 'Réserver' : 'Complet'}
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-carbon-600 mx-auto mb-4" />
              <p className="text-carbon-400">Aucun cours disponible pour cette sélection</p>
            </div>
          )}
        </div>
      </Section>
    </>
  )
}