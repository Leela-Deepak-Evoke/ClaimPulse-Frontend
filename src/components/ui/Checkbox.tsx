import type { InputHTMLAttributes, ReactNode } from 'react'

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className' | 'children'
> {
  label: ReactNode
}

export default function Checkbox({ label, ...input }: CheckboxProps) {
  return (
    <label className="check">
      <input type="checkbox" {...input} />
      {label}
    </label>
  )
}
