import type { ComponentProps, ReactNode } from 'react'
import Link from '../Link.tsx'
import { buttonClass, type ButtonSize, type ButtonVariant } from './buttonClass.ts'

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  icon?: ReactNode
}

export default function ButtonLink({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClass({ variant, size, fullWidth, className })} {...rest}>
      {icon}
      {children}
    </Link>
  )
}
