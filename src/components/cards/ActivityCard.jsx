import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Dumbbell, Heart, Zap, Target, Leaf, Trophy } from 'lucide-react'
import { cn } from '../../utils/helpers'

const iconMap = {
  Dumbbell,
  Heart,
  Zap,
  Target,
  Leaf,
  Trophy,
}

export default function ActivityCard({ activity, index = 0, variant = 'default' }) {
  const Icon = iconMap[activity.icon] || Dumbbell

  if (variant === 'compact') {
    return (
      <Link
        to={`/activites#${activity.slug}`}
        className="group flex items-center gap-4 p-4 card-interactive"
      >
        <div className="w-12 h-12 rounded-xl bg-apex-500/10 flex items-center justify-center group-hover:bg-apex-500/20 transition-colors">
          <Icon className="w-6 h-6 text-apex-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-display text-white group-hover:text-apex-400 transition-colors">
            {activity.name}
          </h4>
          <p className="text-sm text-carbon-400 line-clamp-1">{activity.shortDescription}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-carbon-500 group-hover:text-apex-400 transition-colors" />
      </Link>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/activites#${activity.slug}`}
        className="group block card-interactive overflow-hidden h-full"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ 
              backgroundImage: `url(/images/cardio.png)` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="w-12 h-12 rounded-xl bg-apex-500/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:bg-apex-500/30 transition-colors">
              <Icon className="w-6 h-6 text-apex-400" />
            </div>
            <h3 className="font-display text-xl text-white group-hover:text-apex-400 transition-colors">
              {activity.name}
            </h3>
          </div>
        </div>

        <div className="p-5">
          <p className="text-carbon-400 text-sm line-clamp-2">{activity.shortDescription}</p>
          <div className="mt-4 flex items-center gap-2 text-apex-400 text-sm font-medium">
            <span>Découvrir</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
