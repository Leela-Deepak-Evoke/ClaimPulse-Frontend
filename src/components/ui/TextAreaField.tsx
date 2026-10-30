import { useId, type TextareaHTMLAttributes } from 'react'
import { describedBy } from './fieldA11y.ts'
import FormField, { type FieldChrome } from './FormField.tsx'

interface TextAreaFieldProps
  extends
    FieldChrome,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className' | 'children'> {}

export default function TextAreaField({
  label,
  error,
  hint,
  labelAside,
  optional,
  wide,
  ...textarea
}: TextAreaFieldProps) {
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
      <textarea
        id={id}
        className="input input--area"
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, { error, hint })}
        {...textarea}
      />
    </FormField>
  )
}
