import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from './cx.ts'

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  label: string
  tone?: 'neutral' | 'muted' | 'edit' | 'danger' | 'onDark'
  size?: 'md' | 'lg'
  children: ReactNode
}

export default function IconButton({
  label,
  tone = 'neutral',
  size = 'md',
  type = 'button',
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cx('icon-btn', `icon-btn--${tone}`, size === 'lg' && 'icon-btn--lg', className)}
      aria-label={label}
      {...rest}
    >
      {children}
    </button>
  )
}
