import { useState, useRef } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, CreditCard, User, MapPin, Camera, Upload } from 'lucide-react'
import Section from '../components/ui/Section'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { subscriptions, clubs } from '../data/mockData'
import { cn } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const steps = ['Formule', 'Club', 'Compte', 'Confirmation']

export default function Register() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    plan: searchParams.get('plan') || 'premium',
    club: searchParams.get('club') || '',
    firstName: '', lastName: '', email: '', phone: '', password: ''
  })

  const selectedPlan = subscriptions.find(s => s.id === formData.plan)
  const selectedClub = clubs.find(c => c.id === formData.club)

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }))
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    // Sauvegarder la photo en localStorage avant l'inscription
    if (avatarPreview) {
      localStorage.setItem('pending_avatar', avatarPreview)
    }

    const result = await signUp(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.phone
    )

    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error)
      // En cas d'erreur, on nettoie le localStorage
      localStorage.removeItem('pending_avatar')
    }

    setLoading(false)
  }

  if (success) {
    return (
      <Section className="min-h-screen flex items-center">
        <div className="container-custom">
          <div className="max-w-lg mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="font-display text-2xl text-white mb-4">Inscription réussie !</h2>
              <p className="text-carbon-400 mb-6">
                Un email de confirmation a été envoyé à <strong className="text-white">{formData.email}</strong>. 
                Vérifiez votre boîte mail et cliquez sur le lien pour activer votre compte.
              </p>
              <div className="card bg-carbon-800/50 p-4 mb-6 text-left">
                <h3 className="font-medium text-white mb-2">Récapitulatif</h3>
                <p className="text-carbon-400 text-sm">Formule : <span className="text-white">{selectedPlan?.name}</span></p>
                <p className="text-carbon-400 text-sm">Club : <span className="text-white">{selectedClub?.name}</span></p>
                <p className="text-carbon-400 text-sm">Prix : <span className="text-apex-400">{selectedPlan?.price}€/mois</span></p>
              </div>
              <Link to="/connexion" className="btn-primary w-full justify-center">
                Se connecter <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </Section>
    )
  }

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
                  {/* Photo de profil */}
                  <div className="flex flex-col items-center mb-6">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 rounded-full bg-carbon-800 border-2 border-dashed border-carbon-600 flex items-center justify-center cursor-pointer hover:border-apex-500 transition-colors overflow-hidden"
                    >
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-8 h-8 text-carbon-500" />
                      )}
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      capture="user"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 text-sm text-apex-400 hover:text-apex-300"
                    >
                      {avatarPreview ? 'Changer la photo' : 'Ajouter une photo'}
                    </button>
                  </div>

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

            {/* Step 4: Confirmation */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-2xl text-white mb-6">Confirmez votre inscription</h2>
                
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">
                    {error}
                  </div>
                )}

                <div className="card bg-carbon-800/50 p-4 mb-6">
                  {avatarPreview && (
                    <div className="flex justify-center mb-4">
                      <img src={avatarPreview} alt="Photo" className="w-20 h-20 rounded-full object-cover border-2 border-apex-500" />
                    </div>
                  )}
                  
                  <h3 className="font-medium text-white mb-3">Récapitulatif</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-carbon-400">Formule</span>
                      <span className="text-white">{selectedPlan?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-carbon-400">Club</span>
                      <span className="text-white">{selectedClub?.name || 'Non sélectionné'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-carbon-400">Nom</span>
                      <span className="text-white">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-carbon-400">Email</span>
                      <span className="text-white">{formData.email}</span>
                    </div>
                    <div className="border-t border-carbon-700 my-3"></div>
                    <div className="flex justify-between font-medium">
                      <span className="text-white">Prix mensuel</span>
                      <span className="text-apex-400">{selectedPlan?.price}€/mois</span>
                    </div>
                  </div>
                </div>

                <p className="text-carbon-400 text-sm mb-4">
                  💳 Le paiement sera configuré après la validation de votre email.
                </p>
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
                <Button onClick={handleSubmit} isLoading={loading}>
                  <Check className="w-4 h-4" /> Confirmer l'inscription
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}