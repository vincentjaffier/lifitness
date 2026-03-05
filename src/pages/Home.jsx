import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Users, Shield, Dumbbell, Star, ChevronRight, Sparkles } from 'lucide-react'
import Section, { SectionHeader } from '../components/ui/Section'
import ClubCard from '../components/cards/ClubCard'
import SubscriptionCard from '../components/cards/SubscriptionCard'
import { clubs, subscriptions, testimonials, activities } from '../data/mockData'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/images/hero.png)` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon-950 via-carbon-950/90 to-carbon-950/70" />
        </div>
        <div className="container-custom relative z-10 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="badge-apex mb-6 inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Offre : Frais offert pendant le ramadan
            </span>
            <h1 className="font-display text-display-xl md:text-display-2xl text-white mb-6">
              Atteignez<br /><span className="text-gradient">l'excellence</span>
            </h1>
            <p className="text-xl text-carbon-300 mb-8 max-w-xl">
              Avec 2 salles de sport au Sénégal, Lif'itness s'impose comme une réelle référence en matière de sport.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/inscription" className="btn-primary btn-lg">Commencer<ArrowRight className="w-5 h-5" /></Link>
              <Link to="/clubs" className="btn-secondary btn-lg">Nos clubs</Link>
            </div>
            <div className="mt-16 grid grid-cols-3 gap-8">
              {[{ value: '8+', label: 'Clubs' }, { value: '50K+', label: 'Membres' }, { value: '4.9', label: 'Note' }].map(s => (
                <div key={s.label}><div className="font-display text-3xl text-apex-400">{s.value}</div><div className="text-carbon-400 text-sm">{s.label}</div></div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <Section className="bg-carbon-900/50">
        <div className="container-custom">
          <SectionHeader badge="Pourquoi APEX" title="L'expérience fitness réinventée" />
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Dumbbell, title: 'Équipements Premium', desc: 'Technogym & Hammer Strength' },
              { icon: Users, title: 'Coachs Certifiés', desc: 'Experts pour vos objectifs' },
              { icon: Clock, title: 'Accès Illimité', desc: '7j/7 de 6h à 23h' },
              { icon: Shield, title: 'Sans Engagement', desc: 'Résiliez quand vous voulez' },
            ].map(f => (
              <motion.div key={f.title} variants={item} className="card p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-apex-500/10 flex items-center justify-center">
                  <f.icon className="w-7 h-7 text-apex-400" />
                </div>
                <h3 className="font-display text-lg text-white mb-2">{f.title}</h3>
                <p className="text-carbon-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Clubs */}
      <Section>
        <div className="container-custom">
          <SectionHeader badge="Nos clubs" title="Trouvez votre club LIF'ITNESS" />
          <div className="grid md:grid-cols-3 gap-6">{clubs.slice(0, 6).map((c, i) => <ClubCard key={c.id} club={c} index={i} />)}</div>
          <div className="text-center mt-10"><Link to="/clubs" className="btn-secondary">Voir tous les clubs<ChevronRight className="w-4 h-4" /></Link></div>
        </div>
      </Section>

      {/* Pricing */}
      <Section className="bg-carbon-900/50">
        <div className="container-custom">
          <SectionHeader badge="Abonnements" title="Choisissez votre formule" />
          <div className="grid md:grid-cols-3 gap-6">{subscriptions.map((p, i) => <SubscriptionCard key={p.id} plan={p} index={i} />)}</div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <div className="container-custom">
          <SectionHeader badge="Témoignages" title="Ils ont atteint leurs objectifs" />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-apex-400 fill-apex-400" />)}</div>
                <p className="text-carbon-300 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-apex flex items-center justify-center text-white font-bold">{t.name.split(' ').map(n => n[0]).join('')}</div>
                  <div><div className="font-medium text-white">{t.name}</div><div className="text-sm text-carbon-400">{t.role}</div></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="container-custom">
          <div className="relative card p-8 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-apex opacity-10" />
            <div className="relative z-10">
              <h2 className="font-display text-display-md text-white mb-4">Prêt à transformer votre vie ?</h2>
              <p className="text-carbon-300 mb-8 max-w-xl mx-auto">Rejoignez APEX aujourd'hui. Premier mois à -50%.</p>
              <Link to="/inscription" className="btn-primary btn-lg">Démarrer<ArrowRight className="w-5 h-5" /></Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
