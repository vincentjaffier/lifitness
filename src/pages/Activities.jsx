import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Section, { SectionHeader } from '../components/ui/Section'
import { activities } from '../data/mockData'

export default function Activities() {
  return (
    <>
 <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/images/universcomplet2.png)` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon-950 via-carbon-950/90 to-transparent" />
        </div>
        <div className="container-custom relative z-10">
          <SectionHeader badge="Activités" title="Un univers complet" subtitle="Musculation, cardio, yoga, boxe... Trouvez l'activité qui vous correspond." />
        </div>
      </section>

      <Section>
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {activities.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card overflow-hidden"
              >
                <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${activity.image})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-white mb-2">{activity.name}</h3>
                  <p className="text-carbon-400 mb-4">{activity.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-carbon-300 mb-2">Bénéfices</h4>
                    <div className="flex flex-wrap gap-2">
                      {activity.benefits.map((b, j) => (
                        <span key={j} className="px-3 py-1 bg-carbon-800 rounded-full text-xs text-carbon-300">{b}</span>
                      ))}
                    </div>
                  </div>

                  <Link to="/planning" className="btn-secondary w-full justify-center">
                    Voir les cours <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
