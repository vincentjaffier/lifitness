import { forwardRef } from 'react'
import { cn } from '../../utils/helpers'

const Input = forwardRef(({
  className,
  type = 'text',
  label,
  error,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          'input',
          error && 'input-error',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
