// Subscriptions Page
import { useState } from 'react'
import { motion } from 'framer-motion'
import Section, { SectionHeader } from '../components/ui/Section'
import SubscriptionCard from '../components/cards/SubscriptionCard'
import { subscriptions } from '../data/mockData'

export default function Subscriptions() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <>
      <section className="py-20 bg-carbon-900/50">
        <div className="container-custom">
          <SectionHeader badge="Abonnements" title="Choisissez votre formule" subtitle="Sans engagement, résiliez quand vous voulez." />
          
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={!isAnnual ? 'text-white' : 'text-carbon-400'}>Mensuel</span>
            <button onClick={() => setIsAnnual(!isAnnual)} className={`relative w-14 h-8 rounded-full transition-colors ${isAnnual ? 'bg-apex-500' : 'bg-carbon-700'}`}>
              <span className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={isAnnual ? 'text-white' : 'text-carbon-400'}>Annuel <span className="text-apex-400 text-sm">-25%</span></span>
          </div>
        </div>
      </section>

      <Section>
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {subscriptions.map((plan, i) => <SubscriptionCard key={plan.id} plan={plan} index={i} isAnnual={isAnnual} />)}
          </div>
        </div>
      </Section>
    </>
  )
}
