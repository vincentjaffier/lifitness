import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Users, Clock, Calendar, X, Eye } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import { cn } from '../../utils/helpers'

const days = [
  { value: 'monday', label: 'Lundi' },
  { value: 'tuesday', label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday', label: 'Jeudi' },
  { value: 'friday', label: 'Vendredi' },
  { value: 'saturday', label: 'Samedi' },
  { value: 'sunday', label: 'Dimanche' },
]

const activities = ['cardio', 'musculation', 'crossfit', 'yoga', 'boxing', 'hyrox', 'pilates']

export default function AdminClasses() {
  const { classes, coaches, clubs, updateClass, addClass, deleteClass } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDay, setFilterDay] = useState('')
  const [filterClub, setFilterClub] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [viewingClass, setViewingClass] = useState(null)
  const [formData, setFormData] = useState({
    name: '', activity: 'cardio', coach: '', club: '', day: 'monday', time: '09:00', duration: 45, capacity: 20, status: 'active'
  })

  const filteredClasses = classes.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDay = !filterDay || c.day === filterDay
    const matchesClub = !filterClub || c.club === filterClub
    return matchesSearch && matchesDay && matchesClub
  })

  const getCoachName = (coachId) => {
    const coach = coaches.find(c => c.id === coachId)
    return coach ? `${coach.firstName} ${coach.lastName}` : coachId
  }

  const getClubName = (clubId) => clubs.find(c => c.id === clubId)?.name || clubId
  const getDayLabel = (day) => days.find(d => d.value === day)?.label || day

  const openModal = (classItem = null) => {
    if (classItem) {
      setEditingClass(classItem)
      setFormData({
        name: classItem.name, activity: classItem.activity, coach: classItem.coach,
        club: classItem.club, day: classItem.day, time: classItem.time,
        duration: classItem.duration, capacity: classItem.capacity, status: classItem.status
      })
    } else {
      setEditingClass(null)
      setFormData({ name: '', activity: 'cardio', coach: '', club: '', day: 'monday', time: '09:00', duration: 45, capacity: 20, status: 'active' })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingClass) {
      await updateClass(editingClass.id, formData)
    } else {
      await addClass(formData)
    }
    setIsModalOpen(false)
  }

  const handleDelete = async (classId) => {
    if (window.confirm('Supprimer ce cours ?')) {
      await deleteClass(classId)
    }
  }

  const viewReservations = (classItem) => {
    setViewingClass(classItem)
    setIsViewModalOpen(true)
  }

  // Mock reservations for viewing
  const mockReservations = [
    { id: 1, name: 'Marie Dupont', email: 'marie@email.com', bookedAt: '2024-02-10 14:30' },
    { id: 2, name: 'Thomas Martin', email: 'thomas@email.com', bookedAt: '2024-02-10 15:45' },
    { id: 3, name: 'Sophie Laurent', email: 'sophie@email.com', bookedAt: '2024-02-11 09:00' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Gestion des cours</h1>
          <p className="text-carbon-400">{classes.length} cours au total</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4" /> Créer un cours
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-carbon-500" />
          <input type="text" placeholder="Rechercher..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10" />
        </div>
        <select className="select w-auto" value={filterDay} onChange={(e) => setFilterDay(e.target.value)}>
          <option value="">Tous les jours</option>
          {days.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
        <select className="select w-auto" value={filterClub} onChange={(e) => setFilterClub(e.target.value)}>
          <option value="">Tous les clubs</option>
          {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-carbon-800">
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Cours</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Coach</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Club</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Horaire</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Places</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Statut</th>
                <th className="text-right text-sm font-medium text-carbon-400 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((classItem) => {
                const fillRate = Math.round((classItem.enrolled / classItem.capacity) * 100)
                return (
                  <tr key={classItem.id} className="border-b border-carbon-800/50 hover:bg-carbon-800/20">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{classItem.name}</p>
                        <p className="text-xs text-carbon-400 capitalize">{classItem.activity} • {classItem.duration}min</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-carbon-300">{getCoachName(classItem.coach)}</td>
                    <td className="px-6 py-4 text-carbon-300">{getClubName(classItem.club)}</td>
                    <td className="px-6 py-4">
                      <span className="text-carbon-300">{getDayLabel(classItem.day)} {classItem.time}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-carbon-800 rounded-full overflow-hidden">
                          <div className={cn('h-full rounded-full', fillRate >= 90 ? 'bg-red-500' : fillRate >= 70 ? 'bg-warning-500' : 'bg-success-500')}
                            style={{ width: `${fillRate}%` }} />
                        </div>
                        <span className="text-sm text-carbon-300">{classItem.enrolled}/{classItem.capacity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={classItem.status === 'active' ? 'success' : 'warning'}>
                        {classItem.status === 'active' ? 'Actif' : 'Annulé'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => viewReservations(classItem)} className="p-2 text-carbon-400 hover:text-white hover:bg-carbon-800 rounded-lg" title="Voir réservations">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openModal(classItem)} className="p-2 text-carbon-400 hover:text-white hover:bg-carbon-800 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(classItem.id)} className="p-2 text-carbon-400 hover:text-red-400 hover:bg-carbon-800 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-950/80"
            onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-white">{editingClass ? 'Modifier' : 'Créer'} un cours</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-carbon-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Nom du cours" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Activité</label>
                    <select className="select" value={formData.activity} onChange={(e) => setFormData(p => ({ ...p, activity: e.target.value }))}>
                      {activities.map(a => <option key={a} value={a} className="capitalize">{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Coach</label>
                    <select className="select" value={formData.coach} onChange={(e) => setFormData(p => ({ ...p, coach: e.target.value }))} required>
                      <option value="">Sélectionner</option>
                      {coaches.filter(c => c.status === 'active').map(c => (
                        <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Club</label>
                  <select className="select" value={formData.club} onChange={(e) => setFormData(p => ({ ...p, club: e.target.value }))} required>
                    <option value="">Sélectionner</option>
                    {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Jour</label>
                    <select className="select" value={formData.day} onChange={(e) => setFormData(p => ({ ...p, day: e.target.value }))}>
                      {days.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>
                  <Input type="time" label="Heure" value={formData.time} onChange={(e) => setFormData(p => ({ ...p, time: e.target.value }))} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input type="number" label="Durée (min)" value={formData.duration} onChange={(e) => setFormData(p => ({ ...p, duration: parseInt(e.target.value) }))} min="15" max="120" required />
                  <Input type="number" label="Capacité" value={formData.capacity} onChange={(e) => setFormData(p => ({ ...p, capacity: parseInt(e.target.value) }))} min="1" max="50" required />
                </div>
                <div>
                  <label className="label">Statut</label>
                  <select className="select" value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}>
                    <option value="active">Actif</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Annuler</Button>
                  <Button type="submit" className="flex-1">{editingClass ? 'Enregistrer' : 'Créer'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Reservations Modal */}
      <AnimatePresence>
        {isViewModalOpen && viewingClass && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-950/80"
            onClick={() => setIsViewModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl text-white">{viewingClass.name}</h2>
                  <p className="text-sm text-carbon-400">{getDayLabel(viewingClass.day)} {viewingClass.time} • {viewingClass.enrolled}/{viewingClass.capacity} inscrits</p>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="text-carbon-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                {mockReservations.slice(0, viewingClass.enrolled).map((res) => (
                  <div key={res.id} className="flex items-center justify-between p-3 bg-carbon-800/30 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{res.name}</p>
                      <p className="text-xs text-carbon-400">{res.email}</p>
                    </div>
                    <p className="text-xs text-carbon-500">{res.bookedAt}</p>
                  </div>
                ))}
                {viewingClass.enrolled === 0 && (
                  <p className="text-center text-carbon-400 py-8">Aucune réservation</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
