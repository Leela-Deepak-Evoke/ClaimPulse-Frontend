import { cx } from './cx.ts'

export type ButtonVariant = 'primary' | 'outline' | 'danger'
export type ButtonSize = 'md' | 'sm'

interface ButtonStyleOptions {
  variant: ButtonVariant
  size: ButtonSize
  fullWidth: boolean
  className?: string | undefined
}

export function buttonClass({ variant, size, fullWidth, className }: ButtonStyleOptions): string {
  return cx(
    'btn',
    `btn--${variant}`,
    size === 'sm' && 'btn--sm',
    fullWidth && 'btn--block',
    className,
  )
}
