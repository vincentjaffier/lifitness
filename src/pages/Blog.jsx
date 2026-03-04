import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ArrowRight } from 'lucide-react'
import Section, { SectionHeader } from '../components/ui/Section'
import { blogPosts } from '../data/mockData'
import { formatDate } from '../utils/helpers'

export default function Blog() {
  return (
    <>
      <section className="py-20 bg-carbon-900/50">
        <div className="container-custom">
          <SectionHeader badge="Blog" title="Conseils & Actualités" subtitle="Training, nutrition, bien-être : restez informé." />
        </div>
      </section>

      <Section>
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/blog/${post.slug}`} className="block card-interactive overflow-hidden group">
                  <div className="relative h-48 bg-cover bg-center" style={{ backgroundImage: `url(/images/coaching.png)` }}>
                    <div className="absolute inset-0 bg-carbon-950/40 group-hover:bg-carbon-950/20 transition-colors" />
                    <span className="absolute top-3 left-3 badge-apex">{post.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg text-white group-hover:text-apex-400 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-carbon-400 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 mt-4 text-xs text-carbon-500">
                      <span>{formatDate(post.date, { format: 'short' })}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} min</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
