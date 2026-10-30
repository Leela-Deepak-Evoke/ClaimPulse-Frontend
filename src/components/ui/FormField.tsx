import type { ReactNode } from 'react'
import { cx } from './cx.ts'

export interface FieldChrome {
  label: ReactNode
  error?: string | undefined
  hint?: string | undefined
  labelAside?: ReactNode
  optional?: boolean | undefined
  wide?: boolean | undefined
}

interface FormFieldProps extends FieldChrome {
  id: string
  children: ReactNode
}

export default function FormField({
  id,
  label,
  error,
  hint,
  labelAside,
  optional,
  wide,
  children,
}: FormFieldProps) {
  const labelNode = (
    <label htmlFor={id}>
      {label}
      {optional && <span className="form-field__optional"> (optional)</span>}
    </label>
  )

  return (
    <div className={cx('form-field', wide && 'form-field--wide')}>
      {labelAside ? (
        <div className="form-field__row">
          {labelNode}
          {labelAside}
        </div>
      ) : (
        labelNode
      )}
      {children}
      {hint && !error && (
        <p className="form-field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="form-field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
