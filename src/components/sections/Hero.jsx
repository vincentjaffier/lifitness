import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, ArrowRight, Play, ChevronRight } from 'lucide-react'

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images/hero.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon-950 via-carbon-950/90 to-carbon-950/70" />
        <div className="absolute inset-0 bg-mesh-pattern opacity-30" />
        
        {/* Animated orbs */}
        <div className="glow-orb w-96 h-96 bg-apex-500 -top-48 -right-48" />
        <div className="glow-orb w-64 h-64 bg-apex-600 bottom-0 left-1/4 animate-float" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge-apex mb-6 inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-apex-400 animate-pulse" />
              8 clubs premium en France
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-display-xl md:text-display-2xl text-white mb-6"
          >
            Atteignez{' '}
            <span className="text-gradient">l'excellence</span>
            <br />
            physique
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-carbon-300 mb-8 max-w-xl"
          >
            Des salles de sport haut de gamme, des équipements dernière génération 
            et des coachs d'élite pour transformer votre potentiel en performance.
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-500" />
                <input
                  type="text"
                  placeholder="Ville, code postal ou adresse..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-12 bg-carbon-900/80 backdrop-blur-sm"
                />
              </div>
              <Link
                to={`/clubs${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}
                className="btn-primary"
              >
                <Search className="w-5 h-5" />
                Trouver un club
              </Link>
            </div>
            <p className="text-sm text-carbon-500 mt-3">
              Paris, Lyon, Marseille, Bordeaux, Nice, Toulouse, Lille...
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link to="/inscription" className="btn-primary btn-lg">
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="btn-ghost flex items-center gap-2 text-carbon-300 hover:text-white">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Play className="w-5 h-5 ml-0.5" />
              </div>
              <span>Voir la vidéo</span>
            </button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="absolute bottom-8 left-0 right-0"
        >
          <div className="container-custom">
            <div className="flex flex-wrap items-center gap-8 md:gap-16">
              {[
                { value: '8', label: 'Clubs premium' },
                { value: '50k+', label: 'Membres actifs' },
                { value: '200+', label: 'Coachs certifiés' },
                { value: '4.9', label: 'Note moyenne' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="font-display text-3xl md:text-4xl text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-carbon-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
