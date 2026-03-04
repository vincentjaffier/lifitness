import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, MoreVertical, Building2, Users, MapPin, X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import { cn } from '../../utils/helpers'

export default function AdminClubs() {
  const { clubs, updateClub, addClub, deleteClub } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClub, setEditingClub] = useState(null)
  const [formData, setFormData] = useState({ name: '', city: '', status: 'active' })

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openModal = (club = null) => {
    if (club) {
      setEditingClub(club)
      setFormData({ name: club.name, city: club.city, status: club.status })
    } else {
      setEditingClub(null)
      setFormData({ name: '', city: '', status: 'active' })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingClub) {
      await updateClub(editingClub.id, formData)
    } else {
      await addClub(formData)
    }
    setIsModalOpen(false)
  }

  const handleDelete = async (clubId) => {
    if (window.confirm('Supprimer ce club ?')) {
      await deleteClub(clubId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Gestion des clubs</h1>
          <p className="text-carbon-400">{clubs.length} clubs au total</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4" /> Ajouter un club
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-carbon-500" />
        <input
          type="text"
          placeholder="Rechercher un club..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-carbon-800">
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Club</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Ville</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Membres</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Revenus</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Statut</th>
                <th className="text-right text-sm font-medium text-carbon-400 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClubs.map((club) => (
                <tr key={club.id} className="border-b border-carbon-800/50 hover:bg-carbon-800/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-apex-500/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-apex-400" />
                      </div>
                      <span className="font-medium text-white">{club.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-carbon-300 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-carbon-500" />
                      {club.city}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-carbon-300 flex items-center gap-1">
                      <Users className="w-4 h-4 text-carbon-500" />
                      {club.members.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{club.revenue.toLocaleString()}€</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={club.status === 'active' ? 'success' : 'warning'}>
                      {club.status === 'active' ? 'Actif' : 'Maintenance'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openModal(club)} className="p-2 text-carbon-400 hover:text-white hover:bg-carbon-800 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(club.id)} className="p-2 text-carbon-400 hover:text-red-400 hover:bg-carbon-800 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-950/80"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-white">
                  {editingClub ? 'Modifier le club' : 'Ajouter un club'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-carbon-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nom du club"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <Input
                  label="Ville"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
                <div>
                  <label className="label">Statut</label>
                  <select
                    className="select"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="active">Actif</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingClub ? 'Enregistrer' : 'Ajouter'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
