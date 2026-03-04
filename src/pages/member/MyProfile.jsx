import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Phone, Lock, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Section from '../../components/ui/Section'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function MyProfile() {
  const { user, isAuthenticated, updateProfile, isLoading } = useAuth()
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  if (!isAuthenticated) return <Section><div className="container-custom text-center"><Link to="/connexion" className="btn-primary">Se connecter</Link></div></Section>

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await updateProfile(formData)
    if (result.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <Section size="sm">
      <div className="container-custom max-w-xl">
        <h1 className="font-display text-display-sm text-white mb-8">Mon profil</h1>

        <form onSubmit={handleSubmit} className="card p-6 space-y-6">
          {saved && (
            <div className="p-3 rounded-lg bg-success-500/10 border border-success-500/30 text-success-400 flex items-center gap-2">
              <Check className="w-4 h-4" /> Profil mis à jour
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Prénom" value={formData.firstName} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} />
            <Input label="Nom" value={formData.lastName} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} />
          </div>
          <Input type="email" label="Email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
          <Input type="tel" label="Téléphone" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />

          <Button type="submit" isLoading={isLoading} className="w-full">Enregistrer les modifications</Button>
        </form>

        <div className="card p-6 mt-6">
          <h2 className="font-display text-lg text-white mb-4">Sécurité</h2>
          <button className="btn-secondary w-full justify-center">
            <Lock className="w-4 h-4" /> Changer le mot de passe
          </button>
        </div>
      </div>
    </Section>
  )
}
