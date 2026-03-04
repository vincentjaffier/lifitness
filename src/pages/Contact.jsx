import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Phone, Mail, MapPin, Clock } from 'lucide-react'
import Section, { SectionHeader } from '../components/ui/Section'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <>
      <section className="py-20 bg-carbon-900/50">
        <div className="container-custom">
          <SectionHeader badge="Contact" title="Parlons de vos objectifs" subtitle="Notre équipe est à votre écoute." />
        </div>
      </section>

      <Section>
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="card p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-500/20 flex items-center justify-center">
                    <Send className="w-8 h-8 text-success-400" />
                  </div>
                  <h3 className="font-display text-xl text-white mb-2">Message envoyé !</h3>
                  <p className="text-carbon-400">Nous vous répondrons sous 24h.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Prénom" placeholder="Jean" required />
                    <Input label="Nom" placeholder="Dupont" required />
                  </div>
                  <Input type="email" label="Email" placeholder="jean@email.com" required />
                  <Input type="tel" label="Téléphone" placeholder="06 12 34 56 78" />
                  <div>
                    <label className="label">Sujet</label>
                    <select className="select">
                      <option>Informations abonnement</option>
                      <option>Coaching personnalisé</option>
                      <option>Partenariat entreprise</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Message</label>
                    <textarea className="input min-h-[120px]" placeholder="Votre message..." required />
                  </div>
                  <Button type="submit" isLoading={isSubmitting} className="w-full">
                    Envoyer <Send className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              {[
                { icon: Phone, title: 'Téléphone', content: '+33 1 00 00 00 00', sub: 'Lun-Sam, 9h-19h' },
                { icon: Mail, title: 'Email', content: 'contact@apex-fitness.fr', sub: 'Réponse sous 24h' },
                { icon: MapPin, title: 'Siège social', content: '15 Boulevard des Capucines', sub: '75009 Paris' },
                { icon: Clock, title: 'Horaires clubs', content: '6h - 23h', sub: '7 jours sur 7' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4 p-4 card">
                  <div className="w-12 h-12 rounded-xl bg-apex-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-apex-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <p className="text-carbon-300">{item.content}</p>
                    <p className="text-sm text-carbon-500">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
