import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Signup() {
  const navigate = useNavigate()
  const { signUp, loading } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await signUp(formData.email, formData.password, formData.firstName, formData.lastName, formData.phone)
    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md px-4 text-center">
          <div className="card p-8">
            <h2 className="font-display text-2xl text-white mb-4">✅ Inscription réussie !</h2>
            <p className="text-carbon-400 mb-6">Vérifiez votre email pour confirmer votre compte.</p>
            <Link to="/connexion" className="btn-primary">Se connecter</Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-display-sm text-white mb-2">Créer un compte</h1>
          <p className="text-carbon-400">Rejoignez Lif'itness</p>
        </div>
        <div className="card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
            <div className="grid grid-cols-2 gap-4">
              <Input label="Prénom" value={formData.firstName} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} required />
              <Input label="Nom" value={formData.lastName} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} required />
            </div>
            <Input type="email" label="Email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} required />
            <Input type="tel" label="Téléphone" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
            <Input type="password" label="Mot de passe" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} required />
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="checkbox mt-0.5" required />
              <span className="text-carbon-400">J'accepte les <Link to="/cgv" className="text-apex-400">CGV</Link> et la <Link to="/confidentialite" className="text-apex-400">politique de confidentialité</Link></span>
            </label>
            <Button type="submit" isLoading={loading} className="w-full">Créer mon compte <ArrowRight className="w-4 h-4" /></Button>
          </form>
          <div className="mt-6 pt-6 border-t border-carbon-800 text-center">
            <p className="text-carbon-400">Déjà membre ? <Link to="/connexion" className="text-apex-400 hover:underline">Se connecter</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}