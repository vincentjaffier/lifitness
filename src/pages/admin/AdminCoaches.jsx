import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Star, Phone, Mail, X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import { cn } from '../../utils/helpers'

export default function AdminCoaches() {
  const { coaches, clubs, updateCoach, addCoach, deleteCoach } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoach, setEditingCoach] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', specialty: '', clubs: [], status: 'active'
  })

  const filteredCoaches = coaches.filter(coach =>
    `${coach.firstName} ${coach.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coach.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openModal = (coach = null) => {
    if (coach) {
      setEditingCoach(coach)
      setFormData({
        firstName: coach.firstName, lastName: coach.lastName,
        email: coach.email, phone: coach.phone,
        specialty: coach.specialty, clubs: coach.clubs, status: coach.status
      })
    } else {
      setEditingCoach(null)
      setFormData({ firstName: '', lastName: '', email: '', phone: '', specialty: '', clubs: [], status: 'active' })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingCoach) {
      await updateCoach(editingCoach.id, formData)
    } else {
      await addCoach(formData)
    }
    setIsModalOpen(false)
  }

  const handleDelete = async (coachId) => {
    if (window.confirm('Supprimer ce coach ?')) {
      await deleteCoach(coachId)
    }
  }

  const getClubName = (clubId) => clubs.find(c => c.id === clubId)?.name || clubId

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Gestion des coachs</h1>
          <p className="text-carbon-400">{coaches.length} coachs au total</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4" /> Ajouter un coach
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-carbon-500" />
        <input type="text" placeholder="Rechercher un coach..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10" />
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoaches.map((coach) => (
          <motion.div key={coach.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-apex flex items-center justify-center">
                  <span className="font-bold text-white">{coach.firstName[0]}{coach.lastName[0]}</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">{coach.firstName} {coach.lastName}</h3>
                  <p className="text-sm text-apex-400">{coach.specialty}</p>
                </div>
              </div>
              <Badge variant={coach.status === 'active' ? 'success' : 'warning'}>
                {coach.status === 'active' ? 'Actif' : 'Absent'}
              </Badge>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-carbon-400">
                <Mail className="w-4 h-4" />
                <span className="truncate">{coach.email}</span>
              </div>
              <div className="flex items-center gap-2 text-carbon-400">
                <Phone className="w-4 h-4" />
                <span>{coach.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-carbon-400">
                <Star className="w-4 h-4 text-apex-400" />
                <span>{coach.rating}/5 • {coach.sessionsMonth} séances/mois</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {coach.clubs.map(clubId => (
                <span key={clubId} className="text-xs bg-carbon-800 text-carbon-300 px-2 py-1 rounded">
                  {getClubName(clubId)}
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-4 border-t border-carbon-800">
              <button onClick={() => openModal(coach)} className="flex-1 btn-secondary btn-sm justify-center">
                <Edit2 className="w-4 h-4" /> Modifier
              </button>
              <button onClick={() => handleDelete(coach.id)} className="btn-ghost btn-sm text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-950/80"
            onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-white">{editingCoach ? 'Modifier' : 'Ajouter'} un coach</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-carbon-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Prénom" value={formData.firstName} onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))} required />
                  <Input label="Nom" value={formData.lastName} onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))} required />
                </div>
                <Input type="email" label="Email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} required />
                <Input type="tel" label="Téléphone" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} />
                <Input label="Spécialité" value={formData.specialty} onChange={(e) => setFormData(p => ({ ...p, specialty: e.target.value }))} required />
                <div>
                  <label className="label">Statut</label>
                  <select className="select" value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}>
                    <option value="active">Actif</option>
                    <option value="vacation">En vacances</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Annuler</Button>
                  <Button type="submit" className="flex-1">{editingCoach ? 'Enregistrer' : 'Ajouter'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
