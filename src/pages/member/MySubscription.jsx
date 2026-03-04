import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Section from '../../components/ui/Section'
import Badge from '../../components/ui/Badge'
import { CreditCard, Calendar, ArrowRight } from 'lucide-react'

export default function MySubscription() {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) return <Section><div className="container-custom text-center"><Link to="/connexion" className="btn-primary">Se connecter</Link></div></Section>

  const sub = user?.subscription

  return (
    <Section size="sm">
      <div className="container-custom max-w-2xl">
        <h1 className="font-display text-display-sm text-white mb-8">Mon abonnement</h1>
        
        {sub ? (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Badge variant="apex" className="mb-2">{sub.plan.toUpperCase()}</Badge>
                <h2 className="font-display text-2xl text-white">Formule {sub.plan}</h2>
              </div>
              <Badge variant="success">Actif</Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-carbon-800">
                <span className="text-carbon-400">Tarif mensuel</span>
                <span className="text-white font-medium">{sub.price}€/mois</span>
              </div>
              <div className="flex justify-between py-3 border-b border-carbon-800">
                <span className="text-carbon-400">Date de souscription</span>
                <span className="text-white">{sub.startDate}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-carbon-800">
                <span className="text-carbon-400">Prochain prélèvement</span>
                <span className="text-white">{sub.nextBilling}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-carbon-400">Mode de paiement</span>
                <span className="text-white flex items-center gap-2"><CreditCard className="w-4 h-4" /> •••• 4242</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/abonnements" className="btn-secondary flex-1 justify-center">Changer de formule</Link>
              <button className="btn-ghost text-red-400">Résilier</button>
            </div>
          </div>
        ) : (
          <div className="card p-8 text-center">
            <CreditCard className="w-12 h-12 text-carbon-600 mx-auto mb-4" />
            <h2 className="font-display text-xl text-white mb-2">Aucun abonnement actif</h2>
            <p className="text-carbon-400 mb-6">Souscrivez à un abonnement pour profiter de nos clubs.</p>
            <Link to="/abonnements" className="btn-primary">Voir les offres <ArrowRight className="w-4 h-4" /></Link>
          </div>
        )}
      </div>
    </Section>
  )
}
