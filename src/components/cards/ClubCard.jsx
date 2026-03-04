import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Star, ArrowRight, Sparkles } from 'lucide-react'
import Badge from '../ui/Badge'
import { cn } from '../../utils/helpers'

export default function ClubCard({ club, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/clubs/${club.slug}`}
        className="group block card-interactive overflow-hidden"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-carbon-800 to-carbon-900 animate-pulse" />
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ 
              backgroundImage: `url(/images/equipement.png)` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/20 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {club.isNew && (
              <Badge variant="apex" className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Nouveau
              </Badge>
            )}
            {club.isPremium && (
              <Badge variant="neutral">Premium</Badge>
            )}
          </div>

          {/* Rating */}
          <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-carbon-950/70 backdrop-blur-sm">
            <Star className="w-4 h-4 text-apex-400 fill-apex-400" />
            <span className="text-sm font-medium text-white">{club.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lg text-white group-hover:text-apex-400 transition-colors">
                {club.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-carbon-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">
                  {club.city} {club.district && `• ${club.district}`}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-carbon-800 flex items-center justify-center group-hover:bg-apex-500 transition-colors">
              <ArrowRight className="w-4 h-4 text-carbon-400 group-hover:text-white transition-colors" />
            </div>
          </div>

          {/* Surface */}
          <div className="mt-4 pt-4 border-t border-carbon-800/50 flex items-center justify-between text-sm">
            <span className="text-carbon-500">{club.surface}m² d'espace</span>
            <span className="text-carbon-400">{club.openingHours.weekdays}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Compact version for lists
export function ClubCardCompact({ club }) {
  return (
    <Link
      to={`/clubs/${club.slug}`}
      className="group flex items-center gap-4 p-4 card-interactive"
    >
      <div 
        className="w-20 h-20 rounded-xl bg-cover bg-center flex-shrink-0"
        style={{ 
          backgroundImage: `url(/images/equipement.png)` 
        }}
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-display text-white group-hover:text-apex-400 transition-colors truncate">
          {club.name}
        </h4>
        <p className="text-sm text-carbon-400 mt-1 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {club.city}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-apex-400 fill-apex-400" />
        <span className="text-sm text-white">{club.rating}</span>
      </div>
    </Link>
  )
}
