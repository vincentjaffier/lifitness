import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, CreditCard, User, MapPin } from 'lucide-react'
import Section from '../components/ui/Section'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { subscriptions, clubs } from '../data/mockData'
import { cn } from '../utils/helpers'

const steps = ['Formule', 'Club', 'Compte', 'Paiement']

export default function Register() {
  const [searchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    plan: searchParams.get('plan') || 'premium',
    club: searchParams.get('club') || '',
    firstName: '', lastName: '', email: '', phone: '', password: ''
  })

  const selectedPlan = subscriptions.find(s => s.id === formData.plan)

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }))
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  return (
    <Section className="min-h-screen flex items-center">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-medium',
                  i <= currentStep ? 'bg-apex-500 text-white' : 'bg-carbon-800 text-carbon-500'
                )}>
                  {i < currentStep ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className={cn('w-12 h-0.5 mx-2', i < currentStep ? 'bg-apex-500' : 'bg-carbon-800')} />}
              </div>
            ))}
          </div>

          <div className="card p-6 md:p-8">
            {/* Step 1: Plan */}
            {currentStep === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-2xl text-white mb-6">Choisissez votre formule</h2>
                <div className="space-y-4">
                  {subscriptions.map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => updateForm('plan', plan.id)}
                      className={cn('w-full p-4 rounded-xl border-2 text-left transition-all', formData.plan === plan.id ? 'border-apex-500 bg-apex-500/10' : 'border-carbon-700 hover:border-carbon-600')}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-display text-lg text-white">{plan.name}</div>
                          <div className="text-carbon-400 text-sm">{plan.tagline}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-xl text-apex-400">{plan.price}€<span className="text-sm text-carbon-400">/mois</span></div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Club */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-2xl text-white mb-6">Choisissez votre club</h2>
                <div className="grid gap-3 max-h-96 overflow-y-auto">
                  {clubs.map(club => (
                    <button
                      key={club.id}
                      onClick={() => updateForm('club', club.id)}
                      className={cn('p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4', formData.club === club.id ? 'border-apex-500 bg-apex-500/10' : 'border-carbon-700 hover:border-carbon-600')}
                    >
                      <MapPin className="w-5 h-5 text-apex-400" />
                      <div>
                        <div className="font-medium text-white">{club.name}</div>
                        <div className="text-carbon-400 text-sm">{club.address}, {club.city}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Account */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-2xl text-white mb-6">Créez votre compte</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Prénom" value={formData.firstName} onChange={e => updateForm('firstName', e.target.value)} required />
                    <Input label="Nom" value={formData.lastName} onChange={e => updateForm('lastName', e.target.value)} required />
                  </div>
                  <Input type="email" label="Email" value={formData.email} onChange={e => updateForm('email', e.target.value)} required />
                  <Input type="tel" label="Téléphone" value={formData.phone} onChange={e => updateForm('phone', e.target.value)} />
                  <Input type="password" label="Mot de passe" value={formData.password} onChange={e => updateForm('password', e.target.value)} required />
                </div>
              </motion.div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-2xl text-white mb-6">Paiement</h2>
                <div className="card bg-carbon-800/50 p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-carbon-400">Formule {selectedPlan?.name}</span>
                    <span className="text-white">{selectedPlan?.price}€/mois</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-white">Total aujourd'hui</span>
                    <span className="text-apex-400">{selectedPlan?.price}€</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <Input label="Numéro de carte" placeholder="4242 4242 4242 4242" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Expiration" placeholder="MM/AA" />
                    <Input label="CVC" placeholder="123" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-carbon-800">
              {currentStep > 0 ? (
                <button onClick={prevStep} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Retour</button>
              ) : (
                <Link to="/" className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Accueil</Link>
              )}
              {currentStep < steps.length - 1 ? (
                <Button onClick={nextStep}>Continuer <ArrowRight className="w-4 h-4" /></Button>
              ) : (
                <Button><CreditCard className="w-4 h-4" /> Confirmer l'inscription</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
