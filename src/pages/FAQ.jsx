import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import Section, { SectionHeader } from '../components/ui/Section'
import { faqItems } from '../data/mockData'
import { cn } from '../utils/helpers'

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-carbon-800">
      <button onClick={onClick} className="w-full py-5 flex items-center justify-between text-left">
        <span className={cn('font-medium transition-colors', isOpen ? 'text-apex-400' : 'text-white')}>{question}</span>
        <ChevronDown className={cn('w-5 h-5 text-carbon-400 transition-transform', isOpen && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="pb-5 text-carbon-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState({})

  const toggle = (key) => setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <>
      <section className="py-20 bg-carbon-900/50">
        <div className="container-custom">
          <SectionHeader badge="FAQ" title="Questions fréquentes" subtitle="Trouvez rapidement les réponses à vos questions." />
        </div>
      </section>

      <Section>
        <div className="container-narrow">
          {faqItems.map((category, ci) => (
            <div key={ci} className="mb-12">
              <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-apex-400" /> {category.category}
              </h2>
              <div className="card">
                {category.questions.map((item, qi) => (
                  <FAQItem
                    key={qi}
                    question={item.q}
                    answer={item.a}
                    isOpen={openItems[`${ci}-${qi}`]}
                    onClick={() => toggle(`${ci}-${qi}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
