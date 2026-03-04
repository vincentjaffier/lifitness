import { motion } from 'framer-motion'
import { Check, X, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/helpers'

export default function SubscriptionCard({ plan, index = 0, isAnnual = false }) {
  const price = isAnnual ? plan.priceAnnual : plan.price
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'relative card overflow-hidden',
        plan.popular && 'border-apex-500/50 shadow-glow'
      )}
    >
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-apex" />
      )}
      
      <div className="p-6 md:p-8">
        {plan.popular && (
          <span className="badge-apex mb-3 inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Le plus populaire
          </span>
        )}
        <h3 className="font-display text-2xl text-white">{plan.name}</h3>
        <p className="text-carbon-400 mt-1">{plan.tagline}</p>

        <div className="my-6">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-4xl md:text-5xl text-white">
              {price.toFixed(0)}
            </span>
            <span className="text-carbon-400">,{((price % 1) * 100).toFixed(0)}€/mois</span>
          </div>
          <p className="text-sm text-carbon-500 mt-1">{plan.commitment}</p>
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="w-5 h-5 text-apex-400 flex-shrink-0" />
              ) : (
                <X className="w-5 h-5 text-carbon-600 flex-shrink-0" />
              )}
              <span className={feature.included ? 'text-carbon-200' : 'text-carbon-500'}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>

        <Link
          to={`/inscription?plan=${plan.id}`}
          className={cn('w-full justify-center', plan.popular ? 'btn-primary' : 'btn-secondary')}
        >
          Choisir {plan.name}
        </Link>
      </div>
    </motion.div>
  )
}
