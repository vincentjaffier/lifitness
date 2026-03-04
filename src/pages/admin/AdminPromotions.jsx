import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Calendar, X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import { cn } from '../../utils/helpers'

export default function AdminPromotions() {
  const { promotions, updatePromotion, addPromotion, deletePromotion } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPromo, setEditingPromo] = useState(null)
  const [formData, setFormData] = useState({ name: '', code: '', discount: 10, type: 'percentage', validFrom: '', validTo: '', usageLimit: '', status: 'active', applicablePlans: [] })

  const filteredPromotions = promotions.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase()))
  const statusConfig = { active: { label: 'Active', variant: 'success' }, expired: { label: 'Expirée', variant: 'neutral' }, scheduled: { label: 'Planifiée', variant: 'warning' } }

  const openModal = (promo = null) => {
    if (promo) {
      setEditingPromo(promo)
      setFormData({ name: promo.name, code: promo.code, discount: promo.discount, type: promo.type, validFrom: promo.validFrom, validTo: promo.validTo, usageLimit: promo.usageLimit || '', status: promo.status, applicablePlans: promo.applicablePlans })
    } else {
      setEditingPromo(null)
      setFormData({ name: '', code: '', discount: 10, type: 'percentage', validFrom: '', validTo: '', usageLimit: '', status: 'active', applicablePlans: ['essential', 'premium', 'elite'] })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = { ...formData, usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null }
    if (editingPromo) await updatePromotion(editingPromo.id, data)
    else await addPromotion(data)
    setIsModalOpen(false)
  }

  const handleDelete = async (id) => { if (window.confirm('Supprimer ?')) await deletePromotion(id) }
  const togglePlan = (plan) => setFormData(p => ({ ...p, applicablePlans: p.applicablePlans.includes(plan) ? p.applicablePlans.filter(x => x !== plan) : [...p.applicablePlans, plan] }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="font-display text-2xl text-white mb-1">Offres promotionnelles</h1><p className="text-carbon-400">{promotions.length} promotions</p></div>
        <Button onClick={() => openModal()}><Plus className="w-4 h-4" /> Nouvelle promotion</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-carbon-500" />
        <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPromotions.map((promo) => (
          <motion.div key={promo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium text-white">{promo.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-apex-400 bg-apex-500/10 px-2 py-0.5 rounded text-sm">{promo.code}</code>
                  <Badge variant={statusConfig[promo.status].variant}>{statusConfig[promo.status].label}</Badge>
                </div>
              </div>
              <p className="font-display text-2xl text-white">{promo.type === 'percentage' ? `${promo.discount}%` : `${promo.discount}€`}</p>
            </div>
            <div className="text-sm text-carbon-400 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" />{promo.validFrom} → {promo.validTo}</div>
            {promo.usageLimit && <div className="mb-4"><div className="flex justify-between text-xs text-carbon-400 mb-1"><span>Utilisation</span><span>{promo.usageCount}/{promo.usageLimit}</span></div><div className="w-full h-2 bg-carbon-800 rounded-full"><div className="h-full bg-apex-500 rounded-full" style={{ width: `${(promo.usageCount/promo.usageLimit)*100}%` }} /></div></div>}
            <div className="flex gap-2 pt-4 border-t border-carbon-800">
              <button onClick={() => openModal(promo)} className="flex-1 btn-secondary btn-sm justify-center"><Edit2 className="w-4 h-4" /> Modifier</button>
              <button onClick={() => handleDelete(promo.id)} className="btn-ghost btn-sm text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-950/80" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6"><h2 className="font-display text-xl text-white">{editingPromo ? 'Modifier' : 'Nouvelle'} promotion</h2><button onClick={() => setIsModalOpen(false)} className="text-carbon-400 hover:text-white"><X className="w-5 h-5" /></button></div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Nom" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required />
                <Input label="Code promo" value={formData.code} onChange={(e) => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input type="number" label="Réduction" value={formData.discount} onChange={(e) => setFormData(p => ({ ...p, discount: parseInt(e.target.value) }))} required />
                  <div><label className="label">Type</label><select className="select" value={formData.type} onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}><option value="percentage">Pourcentage</option><option value="fixed">Montant fixe</option></select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input type="date" label="Début" value={formData.validFrom} onChange={(e) => setFormData(p => ({ ...p, validFrom: e.target.value }))} required />
                  <Input type="date" label="Fin" value={formData.validTo} onChange={(e) => setFormData(p => ({ ...p, validTo: e.target.value }))} required />
                </div>
                <Input type="number" label="Limite d'utilisation (optionnel)" value={formData.usageLimit} onChange={(e) => setFormData(p => ({ ...p, usageLimit: e.target.value }))} />
                <div><label className="label">Formules éligibles</label><div className="flex gap-2">{['essential', 'premium', 'elite'].map(plan => (<button key={plan} type="button" onClick={() => togglePlan(plan)} className={cn('px-3 py-1.5 rounded-lg text-sm capitalize', formData.applicablePlans.includes(plan) ? 'bg-apex-500 text-white' : 'bg-carbon-800 text-carbon-400')}>{plan}</button>))}</div></div>
                <div className="flex gap-3 pt-4"><Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Annuler</Button><Button type="submit" className="flex-1">{editingPromo ? 'Enregistrer' : 'Créer'}</Button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
