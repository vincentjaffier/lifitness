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
    const matchesSearch = `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || m.status === filterStatus
    const matchesSub = !filterSubscription || m.subscription === filterSubscription
    return matchesSearch && matchesStatus && matchesSub
  })

  const getClubName = (clubId) => clubs.find(c => c.id === clubId)?.name || clubId

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
      setViewingMember(prev => ({ ...prev, status: newStatus }))
    }
  }

  const handleSubscriptionChange = async (memberId, newSubscription) => {
    await updateMember(memberId, { subscription: newSubscription })
    if (viewingMember?.id === memberId) {
      setViewingMember(prev => ({ ...prev, subscription: newSubscription }))
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Gestion des membres</h1>
          <p className="text-carbon-400">{members.length} membres au total</p>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4" /> Exporter CSV
        </Button>
      </div>

      {/* Filters */}
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Actifs', value: members.filter(m => m.status === 'active').length, color: 'text-success-400' },
          { label: 'Suspendus', value: members.filter(m => m.status === 'suspended').length, color: 'text-warning-400' },
          { label: 'Expirés', value: members.filter(m => m.status === 'expired').length, color: 'text-carbon-400' },
          { label: 'Elite', value: members.filter(m => m.subscription === 'elite').length, color: 'text-electric-400' },
        ].map((stat, i) => (
          <div key={i} className="card p-4 text-center">
            <p className={cn('font-display text-2xl', stat.color)}>{stat.value}</p>
            <p className="text-sm text-carbon-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-carbon-800">
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Membre</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Club</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Abonnement</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Visites</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Statut</th>
                <th className="text-right text-sm font-medium text-carbon-400 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b border-carbon-800/50 hover:bg-carbon-800/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-apex flex items-center justify-center">
                        <span className="font-medium text-white text-sm">{member.firstName[0]}{member.lastName[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-carbon-400">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-carbon-300">{getClubName(member.club)}</td>
                  <td className="px-6 py-4">
                    <span className={cn('text-xs px-2 py-1 rounded-full capitalize', subscriptionColors[member.subscription])}>
                      {member.subscription}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-carbon-300">{member.totalVisits}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusColors[member.status]}>
                      {member.status === 'active' ? 'Actif' : member.status === 'suspended' ? 'Suspendu' : 'Expiré'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => viewMember(member)} className="p-2 text-carbon-400 hover:text-white hover:bg-carbon-800 rounded-lg" title="Voir détails">
                        <Eye className="w-4 h-4" />
                      </button>
                      {member.status === 'active' ? (
                        <button onClick={() => handleStatusChange(member.id, 'suspended')} className="p-2 text-carbon-400 hover:text-warning-400 hover:bg-carbon-800 rounded-lg" title="Suspendre">
                          <UserX className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => handleStatusChange(member.id, 'active')} className="p-2 text-carbon-400 hover:text-success-400 hover:bg-carbon-800 rounded-lg" title="Activer">
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Detail Modal */}
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

              {/* Profile header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-carbon-800">
                <div className="w-16 h-16 rounded-full bg-gradient-apex flex items-center justify-center">
                  <span className="font-bold text-white text-xl">{viewingMember.firstName[0]}{viewingMember.lastName[0]}</span>
                </div>
                <div>
                  <h3 className="font-display text-lg text-white">{viewingMember.firstName} {viewingMember.lastName}</h3>
                  <Badge variant={statusColors[viewingMember.status]}>
                    {viewingMember.status === 'active' ? 'Actif' : viewingMember.status === 'suspended' ? 'Suspendu' : 'Expiré'}
                  </Badge>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-carbon-300">
                  <Mail className="w-4 h-4 text-carbon-500" />
                  <span>{viewingMember.email}</span>
                </div>
                <div className="flex items-center gap-3 text-carbon-300">
                  <Phone className="w-4 h-4 text-carbon-500" />
                  <span>{viewingMember.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-carbon-300">
                  <Calendar className="w-4 h-4 text-carbon-500" />
                  <span>Inscrit le {viewingMember.joinDate}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-carbon-800/30 rounded-lg">
                  <p className="font-display text-xl text-white">{viewingMember.totalVisits}</p>
                  <p className="text-xs text-carbon-400">Visites</p>
                </div>
                <div className="text-center p-3 bg-carbon-800/30 rounded-lg">
                  <p className="font-display text-xl text-white">{getClubName(viewingMember.club).split(' ')[1]}</p>
                  <p className="text-xs text-carbon-400">Club</p>
                </div>
                <div className="text-center p-3 bg-carbon-800/30 rounded-lg">
                  <p className="font-display text-xl text-white capitalize">{viewingMember.subscription}</p>
                  <p className="text-xs text-carbon-400">Formule</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <div>
                  <label className="label">Modifier l'abonnement</label>
                  <select className="select" value={viewingMember.subscription}
                    onChange={(e) => handleSubscriptionChange(viewingMember.id, e.target.value)}>
                    <option value="essential">Essential - 39,90€/mois</option>
                    <option value="premium">Premium - 69,90€/mois</option>
                    <option value="elite">Elite - 149,90€/mois</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  {viewingMember.status === 'active' ? (
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
