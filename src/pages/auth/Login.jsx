import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await signIn(formData.email, formData.password)
    if (result.success) navigate('/espace-membre')
    else setError(result.error)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-display-sm text-white mb-2">Connexion</h1>
          <p className="text-carbon-400">Accédez à votre espace membre</p>
        </div>
        <div className="card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
            <Input type="email" label="Email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} required />
            <div className="relative">
              <Input type={showPassword ? 'text' : 'password'} label="Mot de passe" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-carbon-400 hover:text-white">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <Button type="submit" isLoading={loading} className="w-full">Se connecter <ArrowRight className="w-4 h-4" /></Button>
          </form>
          <div className="mt-6 pt-6 border-t border-carbon-800 text-center">
            <p className="text-carbon-400">Pas encore membre ? <Link to="/inscription" className="text-apex-400 hover:underline">S'inscrire</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}