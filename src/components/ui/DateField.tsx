import { DateInput } from '@mantine/dates'
import { useId } from 'react'
import { DATE_DISPLAY_FORMAT, parseTypedDate } from '../../app/dateParser.ts'
import { CalendarIcon } from '../icons.tsx'
import FormField, { type FieldChrome } from './FormField.tsx'

interface DateFieldProps extends FieldChrome {
  /** The date as YYYY-MM-DD, or an empty string when nothing is picked. */
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minDate?: string
  maxDate?: string
  /** Which calendar view opens first; use "decade" for far-away dates such as birthdays. */
  startLevel?: 'month' | 'year' | 'decade'
}

export default function DateField({
  label,
  error,
  hint,
  labelAside,
  optional,
  wide,
  value,
  onChange,
  placeholder = 'Pick a date',
  minDate,
  maxDate,
  startLevel,
}: DateFieldProps) {
  const id = useId()
  // Mantine renders the hint and error itself so it can link them to the input for screen readers;
  // they reuse the shared field classes to look the same as every other field.
  return (
    <FormField id={id} label={label} labelAside={labelAside} optional={optional} wide={wide}>
      <DateInput
        id={id}
        value={value || null}
        onChange={(next) => onChange(next ?? '')}
        valueFormat={DATE_DISPLAY_FORMAT}
        dateParser={parseTypedDate}
        placeholder={placeholder}
        leftSection={<CalendarIcon />}
        leftSectionPointerEvents="none"
        {...(minDate !== undefined && { minDate })}
        {...(maxDate !== undefined && { maxDate })}
        {...(startLevel !== undefined && { defaultLevel: startLevel })}
        {...(error && { error })}
        {...(!error && hint && { description: hint })}
        inputWrapperOrder={['input', 'description', 'error']}
        classNames={{
          root: 'date-field',
          input: 'input',
          description: 'form-field__hint',
          error: 'form-field__error',
        }}
      />
    </FormField>
  )
}
