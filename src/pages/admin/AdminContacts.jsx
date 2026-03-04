import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Eye, CheckCircle, Clock, AlertCircle, X, Mail, Phone, Calendar } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import Badge from '../../components/ui/Badge'
import { cn } from '../../utils/helpers'

export default function AdminContacts() {
  const { contactRequests, updateContactRequest, admin } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewingContact, setViewingContact] = useState(null)

  const filteredContacts = contactRequests.filter(c => {
    const matchesSearch = `${c.name} ${c.email} ${c.subject}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || c.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const viewContact = (contact) => {
    setViewingContact(contact)
    setIsModalOpen(true)
  }

  const handleStatusChange = async (contactId, newStatus) => {
    await updateContactRequest(contactId, { 
      status: newStatus,
      assignedTo: newStatus === 'in_progress' ? admin.id : null
    })
    if (viewingContact?.id === contactId) {
      setViewingContact(prev => ({ ...prev, status: newStatus }))
    }
  }

  const statusConfig = {
    new: { label: 'Nouveau', variant: 'apex', icon: AlertCircle },
    in_progress: { label: 'En cours', variant: 'warning', icon: Clock },
    resolved: { label: 'Résolu', variant: 'success', icon: CheckCircle }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Demandes de contact</h1>
          <p className="text-carbon-400">{contactRequests.length} demandes au total</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = contactRequests.filter(c => c.status === key).length
          return (
            <button key={key} onClick={() => setFilterStatus(filterStatus === key ? '' : key)}
              className={cn('card p-4 text-center transition-all', filterStatus === key && 'ring-2 ring-apex-500')}>
              <config.icon className={cn('w-6 h-6 mx-auto mb-2',
                key === 'new' && 'text-apex-400',
                key === 'in_progress' && 'text-warning-400',
                key === 'resolved' && 'text-success-400'
              )} />
              <p className="font-display text-2xl text-white">{count}</p>
              <p className="text-sm text-carbon-400">{config.label}</p>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-carbon-500" />
        <input type="text" placeholder="Rechercher..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10" />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredContacts.map((contact) => {
          const status = statusConfig[contact.status]
          return (
            <motion.div key={contact.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="card p-4 hover:bg-carbon-800/30 cursor-pointer" onClick={() => viewContact(contact)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-white truncate">{contact.name}</h3>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className="text-apex-400 text-sm mb-1">{contact.subject}</p>
                  <p className="text-carbon-400 text-sm line-clamp-1">{contact.message}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-carbon-500">{contact.date}</p>
                  <button className="mt-2 p-2 text-carbon-400 hover:text-white hover:bg-carbon-800 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
        {filteredContacts.length === 0 && (
          <div className="text-center py-12 text-carbon-400">
            Aucune demande trouvée
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isModalOpen && viewingContact && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-950/80"
            onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <Badge variant={statusConfig[viewingContact.status].variant}>
                  {statusConfig[viewingContact.status].label}
                </Badge>
                <button onClick={() => setIsModalOpen(false)} className="text-carbon-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <h2 className="font-display text-xl text-white mb-1">{viewingContact.name}</h2>
                <p className="text-apex-400">{viewingContact.subject}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-carbon-300">
                  <Mail className="w-4 h-4 text-carbon-500" />
                  <a href={`mailto:${viewingContact.email}`} className="hover:text-apex-400">{viewingContact.email}</a>
                </div>
                {viewingContact.phone && (
                  <div className="flex items-center gap-3 text-carbon-300">
                    <Phone className="w-4 h-4 text-carbon-500" />
                    <a href={`tel:${viewingContact.phone}`} className="hover:text-apex-400">{viewingContact.phone}</a>
                  </div>
                )}
                <div className="flex items-center gap-3 text-carbon-300">
                  <Calendar className="w-4 h-4 text-carbon-500" />
                  <span>{viewingContact.date}</span>
                </div>
              </div>

              <div className="p-4 bg-carbon-800/30 rounded-xl mb-6">
                <p className="text-carbon-200 whitespace-pre-wrap">{viewingContact.message}</p>
              </div>

              <div className="flex gap-3">
                {viewingContact.status === 'new' && (
                  <button onClick={() => handleStatusChange(viewingContact.id, 'in_progress')}
                    className="btn-secondary flex-1 justify-center">
                    <Clock className="w-4 h-4" /> Prendre en charge
                  </button>
                )}
                {viewingContact.status === 'in_progress' && (
                  <button onClick={() => handleStatusChange(viewingContact.id, 'resolved')}
                    className="btn-primary flex-1 justify-center">
                    <CheckCircle className="w-4 h-4" /> Marquer résolu
                  </button>
                )}
                <a href={`mailto:${viewingContact.email}`} className="btn-secondary flex-1 justify-center">
                  <Mail className="w-4 h-4" /> Répondre
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
