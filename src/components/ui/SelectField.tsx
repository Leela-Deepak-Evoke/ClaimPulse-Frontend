import { useId, type SelectHTMLAttributes } from 'react'
import { describedBy } from './fieldA11y.ts'
import FormField, { type FieldChrome } from './FormField.tsx'

type Option = string | { value: string; label: string }

interface SelectFieldProps
  extends
    FieldChrome,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'className' | 'children'> {
  options: Option[]
  placeholder: string
}

export default function SelectField({
  label,
  error,
  hint,
  labelAside,
  optional,
  wide,
  options,
  placeholder,
  ...select
}: SelectFieldProps) {
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
      <select
        id={id}
        className="input"
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, { error, hint })}
        {...select}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const { value, label: text } =
            typeof option === 'string' ? { value: option, label: option } : option
          return (
            <option key={value} value={value}>
              {text}
            </option>
          )
        })}
      </select>
    </FormField>
  )
}
