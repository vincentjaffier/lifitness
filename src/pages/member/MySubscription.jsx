import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import Section from '../../components/ui/Section'
import Badge from '../../components/ui/Badge'
import { CreditCard, ArrowRight, Phone, CheckCircle, Clock } from 'lucide-react'

const PLANS = {
  essential: { name: 'Essential', price: 19900, label: '19 900 FCFA' },
  premium: { name: 'Premium', price: 34900, label: '34 900 FCFA' },
  elite: { name: 'Elite', price: 74900, label: '74 900 FCFA' }
}

export default function MySubscription() {
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState('home') // home, choose, pay, confirm, success
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('wave')
  const [transactionRef, setTransactionRef] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isAuthenticated) return (
    <Section>
      <div className="container-custom text-center">
        <Link to="/connexion" className="btn-primary">Se connecter</Link>
      </div>
    </Section>
  )

  const currentPlan = user?.subscription_type
  const currentStatus = user?.subscription_status
  const plan = PLANS[currentPlan]

  const handleSubmitPayment = async () => {
    if (!transactionRef.trim()) {
      setError('Veuillez entrer la référence de transaction')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          subscription_type: selectedPlan,
          amount: PLANS[selectedPlan].price,
          payment_method: paymentMethod,
          transaction_ref: transactionRef,
          status: 'pending'
        })

      if (error) throw error
      setStep('success')
    } catch (err) {
      setError('Erreur lors de l\'envoi. Réessayez.')
    } finally {
      setIsLoading(false)
    }
  }

  // Étape succès
  if (step === 'success') {
    return (
      <Section size="sm">
        <div className="container-custom max-w-2xl">
          <div className="card p-8 text-center">
            <CheckCircle className="w-16 h-16 text-success-400 mx-auto mb-4" />
            <h2 className="font-display text-2xl text-white mb-2">Paiement envoyé !</h2>
            <p className="text-carbon-400 mb-2">Votre demande est en cours de vérification.</p>
            <p className="text-carbon-400 mb-6">L'équipe LIF'ITNESS validera votre abonnement dans les 24h.</p>
            <button onClick={() => setStep('home')} className="btn-primary">Retour à mon abonnement</button>
          </div>
        </div>
      </Section>
    )
  }

  // Étape paiement
  if (step === 'pay') {
    return (
      <Section size="sm">
        <div className="container-custom max-w-2xl">
          <h1 className="font-display text-display-sm text-white mb-8">Confirmer le paiement</h1>
          <div className="card p-6 space-y-6">

            {/* Récapitulatif */}
            <div className="p-4 bg-carbon-800/50 rounded-xl">
              <p className="text-carbon-400 text-sm mb-1">Formule choisie</p>
              <p className="text-white font-display text-xl">{PLANS[selectedPlan]?.name} — {PLANS[selectedPlan]?.label}/mois</p>
            </div>

            {/* Choix méthode */}
            <div>
              <p className="label mb-3">Méthode de paiement</p>
              <div className="grid grid-cols-2 gap-3">
                {['wave', 'orange_money'].map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === method ? 'border-apex-500 bg-apex-500/10' : 'border-carbon-700 bg-carbon-800/30'}`}
                  >
                    <p className="font-medium text-white">{method === 'wave' ? '🌊 Wave' : '🟠 Orange Money'}</p>
                    <p className="text-xs text-carbon-400 mt-1">78 377 70 73</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="p-4 bg-apex-500/10 border border-apex-500/30 rounded-xl space-y-2">
              <p className="text-white font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-apex-400" /> Instructions
              </p>
              <p className="text-carbon-300 text-sm">1. Ouvrez votre application <strong>{paymentMethod === 'wave' ? 'Wave' : 'Orange Money'}</strong></p>
              <p className="text-carbon-300 text-sm">2. Envoyez <strong>{PLANS[selectedPlan]?.label}</strong> au <strong>78 377 70 73</strong></p>
              <p className="text-carbon-300 text-sm">3. Copiez la référence de transaction et collez-la ci-dessous</p>
            </div>

            {/* Référence */}
            <div>
              <label className="label">Référence de transaction</label>
              <input
                type="text"
                className="input"
                placeholder="Ex: TXN123456789"
                value={transactionRef}
                onChange={e => setTransactionRef(e.target.value)}
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('choose')} className="btn-secondary flex-1">Retour</button>
              <button onClick={handleSubmitPayment} disabled={isLoading} className="btn-primary flex-1">
                {isLoading ? 'Envoi...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      </Section>
    )
  }

  // Étape choix de plan
  if (step === 'choose') {
    return (
      <Section size="sm">
        <div className="container-custom max-w-2xl">
          <h1 className="font-display text-display-sm text-white mb-8">Choisir une formule</h1>
          <div className="space-y-4">
            {Object.entries(PLANS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => { setSelectedPlan(key); setStep('pay') }}
                className={`w-full card p-5 text-left hover:border-apex-500 transition-all ${currentPlan === key ? 'border-apex-500' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-lg text-white">{p.name}</p>
                    <p className="text-carbon-400 text-sm">{p.label}/mois</p>
                  </div>
                  {currentPlan === key && <Badge variant="apex">Actuel</Badge>}
                  <ArrowRight className="w-5 h-5 text-carbon-400" />
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep('home')} className="btn-ghost mt-4">Annuler</button>
        </div>
      </Section>
    )
  }

  // Page principale
  return (
    <Section size="sm">
      <div className="container-custom max-w-2xl">
        <h1 className="font-display text-display-sm text-white mb-8">Mon abonnement</h1>

        {currentPlan ? (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Badge variant="apex" className="mb-2">{currentPlan?.toUpperCase()}</Badge>
                <h2 className="font-display text-2xl text-white">Formule {plan?.name}</h2>
              </div>
              <Badge variant={currentStatus === 'active' ? 'success' : 'warning'}>
                {currentStatus === 'active' ? 'Actif' : 'En attente'}
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-carbon-800">
                <span className="text-carbon-400">Tarif mensuel</span>
                <span className="text-white font-medium">{plan?.label}/mois</span>
              </div>
              <div className="flex justify-between py-3 border-b border-carbon-800">
                <span className="text-carbon-400">Statut</span>
                <span className={currentStatus === 'active' ? 'text-success-400' : 'text-warning-400'}>
                  {currentStatus === 'active' ? '✓ Actif' : '⏳ En attente de confirmation'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('choose')} className="btn-primary flex-1">
                <CreditCard className="w-4 h-4" /> Renouveler / Changer
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-8 text-center">
            <CreditCard className="w-12 h-12 text-carbon-600 mx-auto mb-4" />
            <h2 className="font-display text-xl text-white mb-2">Aucun abonnement actif</h2>
            <p className="text-carbon-400 mb-6">Souscrivez à un abonnement pour profiter de nos clubs.</p>
            <button onClick={() => setStep('choose')} className="btn-primary">
              Voir les offres <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Paiements en attente */}
        <PendingPayments userId={user?.id} />
      </div>
    </Section>
  )
}

function PendingPayments({ userId }) {
  const [payments, setPayments] = useState([])

  useState(() => {
    if (!userId) return
    supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setPayments(data || []))
  }, [userId])

  if (payments.length === 0) return null

  return (
    <div className="mt-6 card p-6">
      <h3 className="font-display text-lg text-white mb-4">Historique des paiements</h3>
      <div className="space-y-3">
        {payments.map(p => (
          <div key={p.id} className="flex items-center justify-between p-3 bg-carbon-800/30 rounded-lg">
            <div>
              <p className="text-white text-sm font-medium">{PLANS[p.subscription_type]?.name} — {PLANS[p.subscription_type]?.label}</p>
              <p className="text-carbon-400 text-xs">{p.payment_method === 'wave' ? 'Wave' : 'Orange Money'} • Réf: {p.transaction_ref}</p>
            </div>
            <Badge variant={p.status === 'confirmed' ? 'success' : p.status === 'rejected' ? 'error' : 'warning'}>
              {p.status === 'confirmed' ? 'Confirmé' : p.status === 'rejected' ? 'Rejeté' : 'En attente'}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}