import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Clock, Calendar, X, CheckCircle, XCircle } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'

const days = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 7, label: 'Dimanche' },
]

export default function AdminClasses() {
  const { classes, coaches, clubs, updateClass, addClass, deleteClass } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDay, setFilterDay] = useState('')
  const [filterClub, setFilterClub] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    name: '', coach_id: '', club_id: '', day_of_week: 1, start_time: '09:00', duration_minutes: 60, max_spots: 30
  })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filteredClasses = classes.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDay = !filterDay || c.day_of_week === parseInt(filterDay)
    const matchesClub = !filterClub || c.club_id === filterClub
    return matchesSearch && matchesDay && matchesClub
  })

  const getCoachName = (coachId) => {
    const coach = coaches.find(c => c.id === coachId)
    return coach ? `${coach.first_name} ${coach.last_name}` : '—'
  }

  const getClubName = (clubId) => clubs.find(c => c.id === clubId)?.name || clubId
  const getDayLabel = (day) => days.find(d => d.value === day)?.label || day

  const openModal = (classItem = null) => {
    if (classItem) {
      setEditingClass(classItem)
      setFormData({
        name: classItem.name,
        coach_id: classItem.coach_id,
        club_id: classItem.club_id,
        day_of_week: classItem.day_of_week,
        start_time: classItem.start_time?.slice(0, 5) || '09:00',
        duration_minutes: classItem.duration_minutes,
        max_spots: classItem.max_spots
      })
    } else {
      setEditingClass(null)
      setFormData({ name: '', coach_id: '', club_id: '', day_of_week: 1, start_time: '09:00', duration_minutes: 60, max_spots: 30 })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = editingClass
      ? await updateClass(editingClass.id, formData)
      : await addClass(formData)

    setIsModalOpen(false)
    if (result.success) {
      showToast(editingClass ? 'Cours modifié ✓' : 'Cours créé ✓', 'success')
    } else {
      showToast('Erreur lors de l\'opération', 'error')
    }
  }

  const handleDelete = (classItem) => setConfirmDelete(classItem)

  const confirmDeleteClass = async () => {
    const result = await deleteClass(confirmDelete.id)
    setConfirmDelete(null)
    if (result.success) showToast('Cours supprimé', 'error')
    else showToast('Erreur lors de la suppression', 'error')
  }

  // Filtre les coachs selon le club sélectionné
  const filteredCoaches = formData.club_id
    ? coaches.filter(c => {
        const clubIds = Array.isArray(c.club_id) ? c.club_id : [c.club_id]
        return clubIds.includes(formData.club_id)
      })
    : coaches

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
              <h3 className="font-display text-lg text-white mb-2">Supprimer ce cours ?</h3>
              <p className="text-carbon-400 mb-6">"{confirmDelete.name}" sera définitivement supprimé.</p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setConfirmDelete(null)} className="flex-1">Annuler</Button>
                <Button onClick={confirmDeleteClass} className="flex-1 bg-red-500 hover:bg-red-600">Supprimer</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Gestion des cours</h1>
          <p className="text-carbon-400">{classes.length} cours au total</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4" /> Créer un cours
        </Button>
      </div>

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
                <th className="text-right text-sm font-medium text-carbon-400 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((classItem) => (
                <tr key={classItem.id} className="border-b border-carbon-800/50 hover:bg-carbon-800/20">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{classItem.name}</p>
                    <p className="text-xs text-carbon-400">{classItem.duration_minutes}min</p>
                  </td>
                  <td className="px-6 py-4 text-carbon-300">
                    {classItem.coaches
                      ? `${classItem.coaches.first_name} ${classItem.coaches.last_name}`
                      : getCoachName(classItem.coach_id)}
                  </td>
                  <td className="px-6 py-4 text-carbon-300">{getClubName(classItem.club_id)}</td>
                  <td className="px-6 py-4">
                    <span className="text-carbon-300">{getDayLabel(classItem.day_of_week)} {classItem.start_time?.slice(0, 5)}</span>
                  </td>
                  <td className="px-6 py-4 text-carbon-300">{classItem.max_spots} places</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openModal(classItem)} className="p-2 text-carbon-400 hover:text-white hover:bg-carbon-800 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(classItem)} className="p-2 text-carbon-400 hover:text-red-400 hover:bg-carbon-800 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClasses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-carbon-400">Aucun cours trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal création/modification */}
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
                <Input label="Nom du cours" value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required />

                <div>
                  <label className="label">Club</label>
                  <select className="select" value={formData.club_id}
                    onChange={(e) => setFormData(p => ({ ...p, club_id: e.target.value, coach_id: '' }))} required>
                    <option value="">Sélectionner un club</option>
                    {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Coach</label>
                  <select className="select" value={formData.coach_id}
                    onChange={(e) => setFormData(p => ({ ...p, coach_id: e.target.value }))} required>
                    <option value="">Sélectionner un coach</option>
                    {filteredCoaches.map(c => (
                      <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                    ))}
                  </select>
                  {formData.club_id && filteredCoaches.length === 0 && (
                    <p className="text-warning-400 text-xs mt-1">Aucun coach disponible pour ce club</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Jour</label>
                    <select className="select" value={formData.day_of_week}
                      onChange={(e) => setFormData(p => ({ ...p, day_of_week: parseInt(e.target.value) }))}>
                      {days.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>
                  <Input type="time" label="Heure" value={formData.start_time}
                    onChange={(e) => setFormData(p => ({ ...p, start_time: e.target.value }))} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input type="number" label="Durée (min)" value={formData.duration_minutes}
                    onChange={(e) => setFormData(p => ({ ...p, duration_minutes: parseInt(e.target.value) }))}
                    min="15" max="120" required />
                  <Input type="number" label="Places max" value={formData.max_spots}
                    onChange={(e) => setFormData(p => ({ ...p, max_spots: parseInt(e.target.value) }))}
                    min="1" max="100" required />
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
    </div>
  )
}