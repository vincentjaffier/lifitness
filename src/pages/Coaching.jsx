import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Users, Target, Calendar } from 'lucide-react'
import Section, { SectionHeader } from '../components/ui/Section'

export default function Coaching() {
  const programs = [
    { name: 'Séance découverte', price: 'Gratuit', desc: 'Bilan forme + 1 séance offerte', features: ['Évaluation condition physique', 'Définition objectifs', '1 séance coaching'] },
    { name: 'Pack 5 séances', price: '199€', desc: 'Idéal pour démarrer', features: ['5 séances de 60min', 'Programme personnalisé', 'Suivi nutrition'] },
    { name: 'Pack 10 séances', price: '349€', desc: 'Transformation garantie', features: ['10 séances de 60min', 'Programme évolutif', 'Suivi nutrition', 'Accès app coaching'] },
  ]

  return (
    <>
      <section className="py-20 bg-carbon-900/50">
        <div className="container-custom">
          <SectionHeader badge="Coaching" title="Atteignez vos objectifs" subtitle="Nos coachs certifiés vous accompagnent vers l'excellence." />
        </div>
      </section>

      <Section>
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
                <h3 className="font-display text-xl text-white">{p.name}</h3>
                <div className="text-3xl font-bold text-apex-400 my-4">{p.price}</div>
                <p className="text-carbon-400 mb-4">{p.desc}</p>
                <ul className="space-y-2 mb-6">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-carbon-300"><Check className="w-4 h-4 text-apex-400" />{f}</li>
                  ))}
                </ul>
                <Link to="/contact" className="btn-secondary w-full justify-center">En savoir plus</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
