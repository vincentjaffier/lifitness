import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Eye, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAdmin } from '../../context/AdminContext'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const PLANS = {
  essential: { name: 'Essential', label: '19 900 FCFA' },
  premium: { name: 'Premium', label: '34 900 FCFA' },
  elite: { name: 'Elite', label: '74 900 FCFA' }
}

export default function AdminPayments() {
  const { admin } = useAdmin()
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewingPayment, setViewingPayment] = useState(null)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select(`*, profiles(first_name, last_name, email, avatar_url)`)
      .order('created_at', { ascending: false })

    if (!error) setPayments(data || [])
    setIsLoading(false)
  }

  const handleConfirm = async (payment) => {
    // Confirmer le paiement
    await supabase
      .from('payments')
      .update({
        status: 'confirmed',
        confirmed_by: admin.id,
        confirmed_at: new Date().toISOString()
      })
      .eq('id', payment.id)

    // Activer l'abonnement du membre
    await supabase
      .from('profiles')
      .update({
        subscription_type: payment.subscription_type,
        subscription_status: 'active'
      })
      .eq('id', payment.user_id)

    await fetchPayments()
    setViewingPayment(null)
  }

  const handleReject = async (payment) => {
    await supabase
      .from('payments')
      .update({ status: 'rejected' })
      .eq('id', payment.id)

    await fetchPayments()
    setViewingPayment(null)
  }

  const filteredPayments = payments.filter(p =>
    filter === 'all' ? true : p.status === filter
  )

  const pendingCount = payments.filter(p => p.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Paiements</h1>
          <p className="text-carbon-400">{pendingCount} en attente de confirmation</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        {[
          { key: 'pending', label: 'En attente' },
          { key: 'confirmed', label: 'Confirmés' },
          { key: 'rejected', label: 'Rejetés' },
          { key: 'all', label: 'Tous' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f.key ? 'bg-apex-500 text-white' : 'bg-carbon-800 text-carbon-400 hover:text-white'}`}
          >
            {f.label}
            {f.key === 'pending' && pendingCount > 0 && (
              <span className="ml-2 bg-white text-apex-500 text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-carbon-800">
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Membre</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Formule</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Méthode</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Référence</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Date</th>
                <th className="text-left text-sm font-medium text-carbon-400 px-6 py-4">Statut</th>
                <th className="text-right text-sm font-medium text-carbon-400 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => (
                <tr key={payment.id} className="border-b border-carbon-800/50 hover:bg-carbon-800/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-apex flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {payment.profiles?.first_name?.[0]}{payment.profiles?.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm">{payment.profiles?.first_name} {payment.profiles?.last_name}</p>
                        <p className="text-carbon-400 text-xs">{payment.profiles?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white text-sm">{PLANS[payment.subscription_type]?.name}</p>
                    <p className="text-carbon-400 text-xs">{PLANS[payment.subscription_type]?.label}</p>
                  </td>
                  <td className="px-6 py-4 text-carbon-300 text-sm">
                    {payment.payment_method === 'wave' ? '🌊 Wave' : '🟠 Orange Money'}
                  </td>
                  <td className="px-6 py-4 text-carbon-300 text-sm font-mono">{payment.transaction_ref}</td>
                  <td className="px-6 py-4 text-carbon-400 text-sm">
                    {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={payment.status === 'confirmed' ? 'success' : payment.status === 'rejected' ? 'error' : 'warning'}>
                      {payment.status === 'confirmed' ? 'Confirmé' : payment.status === 'rejected' ? 'Rejeté' : 'En attente'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {payment.status === 'pending' && (
                        <>
                          <button onClick={() => handleConfirm(payment)} className="p-2 text-success-400 hover:bg-carbon-800 rounded-lg" title="Confirmer">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleReject(payment)} className="p-2 text-red-400 hover:bg-carbon-800 rounded-lg" title="Rejeter">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-carbon-400">
                    Aucun paiement {filter === 'pending' ? 'en attente' : ''}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}