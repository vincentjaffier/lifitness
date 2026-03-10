import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Phone, Mail, X, CheckCircle, XCircle } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'

export default function AdminCoaches() {
  const { coaches, clubs, updateCoach, addCoach, deleteCoach } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoach, setEditingCoach] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', specialties: [], club_id: []
  })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filteredCoaches = coaches.filter(coach => {
    const fullName = `${coach.first_name || ''} ${coach.last_name || ''}`.toLowerCase()
    const specialties = Array.isArray(coach.specialties) ? coach.specialties.join(' ').toLowerCase() : ''
    return fullName.includes(searchQuery.toLowerCase()) || specialties.includes(searchQuery.toLowerCase())
  })

  const openModal = (coach = null) => {
    if (coach) {
      setEditingCoach(coach)
      setFormData({
        first_name: coach.first_name || '',
        last_name: coach.last_name || '',
        email: coach.email || '',
        phone: coach.phone || '',
        specialties: coach.specialties || [],
        club_id: Array.isArray(coach.club_id) ? coach.club_id : [coach.club_id].filter(Boolean)
      })
    } else {
      setEditingCoach(null)
      setFormData({ first_name: '', last_name: '', email: '', phone: '', specialties: [], club_id: [] })
    }
    setIsModalOpen(true)
  }

  const handleClubToggle = (clubId, checked) => {
    setFormData(p => ({
      ...p,
      club_id: checked
        ? [...p.club_id, clubId]
        : p.club_id.filter(id => id !== clubId)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.club_id.length === 0) {
      showToast('Sélectionnez au moins un club', 'error')
      return
    }
    const result = editingCoach
      ? await updateCoach(editingCoach.id, formData)
      : await addCoach(formData)

    setIsModalOpen(false)
    if (result.success) {
      showToast(editingCoach ? 'Coach modifié ✓' : 'Coach ajouté ✓', 'success')
    } else {
      showToast('Erreur lors de l\'opération', 'error')
    }
  }

  const handleDelete = async (coach) => {
    setConfirmDelete(coach)
  }

  const confirmDeleteCoach = async () => {
    const result = await deleteCoach(confirmDelete.id)
    setConfirmDelete(null)
    if (result.success) {
      showToast('Coach supprimé', 'error')
    } else {
      showToast('Erreur lors de la suppression', 'error')
    }
  }

  const getClubNames = (clubId) => {
    const ids = Array.isArray(clubId) ? clubId : [clubId].filter(Boolean)
    return ids.map(id => clubs.find(c => c.id === id)?.name || id).join(', ')
  }

  const handleSpecialties = (value) => {
    const arr = value.split(',').map(s => s.trim()).filter(Boolean)
    setFormData(p => ({ ...p, specialties: arr }))
  }

  return (
    <div className="space-y-6">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl ${toast.type === 'success' ? 'bg-success-500 text-white' : 'bg-red-500 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal confirmation suppression */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-950/80">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 w-full max-w-sm text-center">
              <h3 className="font-display text-lg text-white mb-2">Supprimer ce coach ?</h3>
              <p className="text-carbon-400 mb-6">{confirmDelete.first_name} {confirmDelete.last_name} sera définitivement supprimé.</p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setConfirmDelete(null)} className="flex-1">Annuler</Button>
                <Button onClick={confirmDeleteCoach} className="flex-1 bg-red-500 hover:bg-red-600">Supprimer</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Gestion des coachs</h1>
          <p className="text-carbon-400">{coaches.length} coachs au total</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4" /> Ajouter un coach
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-carbon-500" />
        <input type="text" placeholder="Rechercher un coach..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoaches.map((coach) => (
          <motion.div key={coach.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-apex flex items-center justify-center">
                  <span className="font-bold text-white">
                    {(coach.first_name || '?')[0]}{(coach.last_name || '?')[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-white">{coach.first_name} {coach.last_name}</h3>
                  <p className="text-sm text-apex-400">
                    {Array.isArray(coach.specialties) ? coach.specialties.join(', ') : coach.specialties}
                  </p>
                </div>
              </div>
              <Badge variant="success">Actif</Badge>
            </div>

            <div className="space-y-2 text-sm mb-4">
              {coach.email && (
                <div className="flex items-center gap-2 text-carbon-400">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{coach.email}</span>
                </div>
              )}
              {coach.phone && (
                <div className="flex items-center gap-2 text-carbon-400">
                  <Phone className="w-4 h-4" />
                  <span>{coach.phone}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {(Array.isArray(coach.club_id) ? coach.club_id : [coach.club_id]).filter(Boolean).map(id => (
                <span key={id} className="text-xs bg-carbon-800 text-carbon-300 px-2 py-1 rounded">
                  {clubs.find(c => c.id === id)?.name || id}
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-4 border-t border-carbon-800">
              <button onClick={() => openModal(coach)} className="flex-1 btn-secondary btn-sm justify-center">
                <Edit2 className="w-4 h-4" /> Modifier
              </button>
              <button onClick={() => handleDelete(coach)} className="btn-ghost btn-sm text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal ajout/modification */}
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
                  <Input label="Prénom" value={formData.first_name} onChange={(e) => setFormData(p => ({ ...p, first_name: e.target.value }))} required />
                  <Input label="Nom" value={formData.last_name} onChange={(e) => setFormData(p => ({ ...p, last_name: e.target.value }))} required />
                </div>
                <Input type="email" label="Email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} />
                <Input type="tel" label="Téléphone" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} />
                <Input
                  label="Spécialités (séparées par des virgules)"
                  value={Array.isArray(formData.specialties) ? formData.specialties.join(', ') : ''}
                  onChange={(e) => handleSpecialties(e.target.value)}
                  required
                />
                <div>
                  <label className="label">Club(s)</label>
                  <div className="space-y-2">
                    {clubs.map(club => (
                      <label key={club.id} className="flex items-center gap-3 p-3 bg-carbon-800/30 rounded-lg cursor-pointer hover:bg-carbon-800/50">
                        <input
                          type="checkbox"
                          checked={formData.club_id.includes(club.id)}
                          onChange={(e) => handleClubToggle(club.id, e.target.checked)}
                          className="w-4 h-4 accent-apex-500"
                        />
                        <span className="text-white text-sm">{club.name}</span>
                      </label>
                    ))}
                  </div>
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