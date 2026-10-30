import type { ReactNode } from 'react'
import { cx } from './cx.ts'

export default function FormActions({ wide, children }: { wide?: boolean; children: ReactNode }) {
  return <div className={cx('form-actions', wide && 'form-field--wide')}>{children}</div>
}
