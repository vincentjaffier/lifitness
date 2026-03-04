import { motion } from 'framer-motion'
import { cn } from '../../utils/helpers'

export default function Section({
  className,
  children,
  size = 'default',
  ...props
}) {
  const sizeClasses = {
    sm: 'section-sm',
    default: 'section',
    lg: 'py-24 md:py-32 lg:py-40',
  }

  return (
    <section
      className={cn(sizeClasses[size], className)}
      {...props}
    >
      {children}
    </section>
  )
}

export function SectionHeader({
  className,
  title,
  subtitle,
  badge,
  align = 'center',
  children,
}) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn('max-w-3xl mb-12 md:mb-16', alignClasses[align], className)}
    >
      {badge && (
        <span className="badge-apex mb-4 inline-block">
          {badge}
        </span>
      )}
      {title && (
        <h2 className="section-title text-balance">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={cn('section-subtitle', align === 'center' && 'mx-auto')}>
          {subtitle}
        </p>
      )}
      {children}
    </motion.div>
  )
}
