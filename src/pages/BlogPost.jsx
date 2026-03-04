import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Clock, User } from 'lucide-react'
import Section from '../components/ui/Section'
import { blogPosts } from '../data/mockData'
import { formatDate } from '../utils/helpers'

export default function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    return (
      <Section>
        <div className="container-custom text-center">
          <h1 className="font-display text-2xl text-white mb-4">Article non trouvé</h1>
          <Link to="/blog" className="btn-secondary">Retour au blog</Link>
        </div>
      </Section>
    )
  }

  return (
    <>
      <section className="py-12 bg-carbon-900/50">
        <div className="container-narrow">
          <Link to="/blog" className="inline-flex items-center gap-2 text-carbon-400 hover:text-white mb-6">
            <ChevronLeft className="w-4 h-4" /> Retour au blog
          </Link>
          <span className="badge-apex mb-4 inline-block">{post.category}</span>
          <h1 className="font-display text-display-sm md:text-display-md text-white mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-carbon-400">
            <span className="flex items-center gap-2"><User className="w-4 h-4" />{post.author}</span>
            <span>{formatDate(post.date)}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime} min</span>
          </div>
        </div>
      </section>

      <Section>
        <div className="container-narrow">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="lead text-carbon-300">{post.excerpt}</p>
            <div className="h-80 bg-cover bg-center rounded-2xl my-8" style={{ backgroundImage: `url(/images/coaching.png)` }} />
            <p className="text-carbon-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <h2 className="font-display text-2xl text-white mt-8 mb-4">Les fondamentaux</h2>
            <p className="text-carbon-300">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}
