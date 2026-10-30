import type { ButtonHTMLAttributes } from 'react'
import { cx } from './cx.ts'

export default function TextButton({
  type = 'button',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cx('text-button', className)} {...rest} />
}
