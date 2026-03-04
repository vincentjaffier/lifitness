import { cn } from '../../utils/helpers'

const variants = {
  apex: 'badge-apex',
  success: 'badge-success',
  warning: 'badge-warning',
  neutral: 'badge-neutral',
}

export default function Badge({
  className,
  variant = 'neutral',
  children,
  ...props
}) {
  return (
    <span
      className={cn(variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
}
