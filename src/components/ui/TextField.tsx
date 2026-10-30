import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { describedBy } from './fieldA11y.ts'
import FormField, { type FieldChrome } from './FormField.tsx'
import InputWrap from './InputWrap.tsx'

interface TextFieldProps
  extends
    FieldChrome,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className' | 'children'> {
  icon?: ReactNode
  endAdornment?: ReactNode
}

export default function TextField({
  label,
  error,
  hint,
  labelAside,
  optional,
  wide,
  icon,
  endAdornment,
  ...input
}: TextFieldProps) {
  const id = useId()
  return (
    <FormField
      id={id}
      label={label}
      error={error}
      hint={hint}
      labelAside={labelAside}
      optional={optional}
      wide={wide}
    >
      <InputWrap icon={icon} end={endAdornment}>
        <input
          id={id}
          className="input"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, { error, hint })}
          {...input}
        />
      </InputWrap>
    </FormField>
  )
}
