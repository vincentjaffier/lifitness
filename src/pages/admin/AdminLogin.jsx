import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { adminLogin, isAdminAuthenticated, isLoading } = useAdmin()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ email: '', password: '' })

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin')
    }
  }, [isAdminAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await adminLogin(formData.email, formData.password)
    if (result.success) {
      navigate('/admin')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-carbon-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-apex-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-apex-600/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-apex rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-2xl text-white mb-2">Administration LIF'ITNESS</h1>
          <p className="text-carbon-400">Connectez-vous pour accéder au back-office</p>
        </div>

        <div className="card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Input
              type="email"
              label="Email administrateur"
              placeholder="lifitnessgyms@gmail.com"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Mot de passe"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-carbon-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full">
              Accéder au back-office
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-carbon-800">
            <p className="text-xs text-carbon-500 text-center">
              Accès réservé aux administrateurs LIF'ITNESS
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}