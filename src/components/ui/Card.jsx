import { cn } from '../../utils/helpers'

export default function Card({
  className,
  children,
  hover = false,
  interactive = false,
  padding = 'default',
  ...props
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        interactive ? 'card-interactive' : hover ? 'card-hover' : 'card',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, as: Tag = 'h3' }) {
  return (
    <Tag className={cn('font-display text-xl text-white', className)}>
      {children}
    </Tag>
  )
}

export function CardDescription({ className, children }) {
  return (
    <p className={cn('text-carbon-400 mt-1', className)}>
      {children}
    </p>
  )
}

export function CardContent({ className, children }) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-carbon-800', className)}>
      {children}
    </div>
  )
}
