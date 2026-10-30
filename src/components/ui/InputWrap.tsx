import type { ReactNode } from 'react'
import { cx } from './cx.ts'

interface InputWrapProps {
  icon?: ReactNode
  end?: ReactNode
  children: ReactNode
}

export default function InputWrap({ icon, end, children }: InputWrapProps) {
  return (
    <div
      className={cx(
        'input-wrap',
        Boolean(icon) && 'input-wrap--icon',
        Boolean(end) && 'input-wrap--end',
      )}
    >
      {icon && (
        <span className="input-wrap__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {end && <span className="input-wrap__end">{end}</span>}
    </div>
  )
}
