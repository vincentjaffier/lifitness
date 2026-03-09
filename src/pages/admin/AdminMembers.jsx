import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Eye, UserX, UserCheck, Mail, Phone, Calendar, X, Download } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { cn } from '../../utils/helpers'

export default function AdminMembers() {
  const { members, clubs, updateMember, suspendMember, activateMember } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSubscription, setFilterSubscription] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewingMember, setViewingMember] = useState(null)

  const filteredMembers = members.filter(m => {
    const firstName = m.first_name || ''
    const lastName = m.last_name || ''
    const matchesSearch = `${firstName} ${lastName} ${m.email}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || m.subscription_status === filterStatus
    const matchesSub = !filterSubscription || m.subscription_type === filterSubscription
    return matchesSearch && matchesStatus && matchesSub
  })

  const getClubName = (clubId) => clubs.find(c => c.id === clubId)?.name || clubId || 'Non défini'

  const viewMember = (member) => {
    setViewingMember(member)
    setIsModalOpen(true)
  }

  const handleStatusChange = async (memberId, newStatus) => {
    if (newStatus === 'suspended') {
      await suspendMember(memberId)
    } else {
      await activateMember(memberId)
    }
    if (viewingMember?.id === memberId) {
      setViewingMember(prev => ({ ...prev, subscription_status: newStatus }))
    }
  }

  const handleSubscriptionChange = async (memberId, newSubscription) => {
    await updateMember(memberId, { subscription_type: newSubscription })
    if (viewingMember?.id === memberId) {
      setViewingMember(prev => ({ ...prev, subscription_type: newSubscription }))
    }
  }

  const statusColors = {
    active: 'success',
    suspended: 'warning',
    expired: 'neutral'
  }

  const subscriptionColors = {
    elite: 'bg-electric-500/20 text-electric-400',
    premium: 'bg-apex-500/20 text-apex-400',
    essential: 'bg-carbon-700 text-carbon-300'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Gestion des membres</h1>
          <p className="text-carbon-400">{members.length} membres au total</p>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4" /> Exporter CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-carbon-500" />
          <input type="text" placeholder="Rechercher un membre..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10" />
        </div>
        <select className="select w-auto" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="suspended">Suspendu</option>
          <option value="expired">Expiré</option>
        </select>
        <select className="select w-auto" value={filterSubscription} onChange={(e) => setFilterSubscription(e.target.value)}>
          <option value="">Tous les abonnements</option>
          <option value="elite">Elite</option>
          <option value="premium">Premium</option>
          <option value="essential">Essential</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Actifs', value: members.filter(m => m.subscription_status === 'active').length, color: 'text-success-400' },
          { label: 'Suspendus', value: members.filter(m => m.subscription_status === 'suspended').length, color: 'text-warning-400' },
          { label: 'Expirés', value: members.filter(m => m.subscription_status === 'expired').length, color: 'text-carbon-400' },
          { label: 'Elite', value: members.filter(m => m.subscription_type === 'elite').length, color: 'text-electric-400' },
        ].map((stat, i) => (
          <div key={i} className="card p-4 text-center">
            <p className={cn('font-display text-2xl', stat.color)}>{stat.value}</p>
            <p className="text-sm text-carbon-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-carbon-800">
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Membre</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Abonnement</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Statut</th>
                <th className="text-right text-sm font-medium text-carbon-400 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => {
                const firstName = member.first_name || '?'
                const lastName = member.last_name || '?'
                return (
                  <tr key={member.id} className="border-b border-carbon-800/50 hover:bg-carbon-800/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-apex flex items-center justify-center overflow-hidden">
                          {member.avatar_url ? (
                            <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-medium text-white text-sm">{firstName[0]}{lastName[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{firstName} {lastName}</p>
                          <p className="text-xs text-carbon-400">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('text-xs px-2 py-1 rounded-full capitalize', subscriptionColors[member.subscription_type] || 'bg-carbon-700 text-carbon-300')}>
                        {member.subscription_type || 'Non défini'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusColors[member.subscription_status] || 'neutral'}>
                        {member.subscription_status === 'active' ? 'Actif' : member.subscription_status === 'suspended' ? 'Suspendu' : 'Expiré'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => viewMember(member)} className="p-2 text-carbon-400 hover:text-white hover:bg-carbon-800 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        {member.subscription_status === 'active' ? (
                          <button onClick={() => handleStatusChange(member.id, 'suspended')} className="p-2 text-carbon-400 hover:text-warning-400 hover:bg-carbon-800 rounded-lg">
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button onClick={() => handleStatusChange(member.id, 'active')} className="p-2 text-carbon-400 hover:text-success-400 hover:bg-carbon-800 rounded-lg">
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-carbon-400">
                    Aucun membre trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && viewingMember && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-950/80"
            onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-white">Profil membre</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-carbon-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-carbon-800">
                <div className="w-16 h-16 rounded-full bg-gradient-apex flex items-center justify-center overflow-hidden">
                  {viewingMember.avatar_url ? (
                    <img src={viewingMember.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-white text-xl">
                      {(viewingMember.first_name || '?')[0]}{(viewingMember.last_name || '?')[0]}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-lg text-white">{viewingMember.first_name} {viewingMember.last_name}</h3>
                  <Badge variant={statusColors[viewingMember.subscription_status] || 'neutral'}>
                    {viewingMember.subscription_status === 'active' ? 'Actif' : viewingMember.subscription_status === 'suspended' ? 'Suspendu' : 'Non défini'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-carbon-300">
                  <Mail className="w-4 h-4 text-carbon-500" />
                  <span>{viewingMember.email}</span>
                </div>
                {viewingMember.phone && (
                  <div className="flex items-center gap-3 text-carbon-300">
                    <Phone className="w-4 h-4 text-carbon-500" />
                    <span>{viewingMember.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-carbon-300">
                  <Calendar className="w-4 h-4 text-carbon-500" />
                  <span>Inscrit le {new Date(viewingMember.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="label">Modifier l'abonnement</label>
                  <select className="select" value={viewingMember.subscription_type || ''}
                    onChange={(e) => handleSubscriptionChange(viewingMember.id, e.target.value)}>
                    <option value="">Non défini</option>
                    <option value="essential">Essential</option>
                    <option value="premium">Premium</option>
                    <option value="elite">Elite</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  {viewingMember.subscription_status === 'active' ? (
                    <Button variant="secondary" onClick={() => handleStatusChange(viewingMember.id, 'suspended')} className="flex-1">
                      <UserX className="w-4 h-4" /> Suspendre
                    </Button>
                  ) : (
                    <Button onClick={() => handleStatusChange(viewingMember.id, 'active')} className="flex-1">
                      <UserCheck className="w-4 h-4" /> Activer
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}