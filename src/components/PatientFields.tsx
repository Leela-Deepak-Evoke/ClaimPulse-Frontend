import { useState, type ChangeEvent } from 'react'
import { GENDERS, type PatientFormErrors, type PatientFormValues } from '../app/patientForm.ts'
import { DateField, SelectField, TextField } from './ui/index.ts'

interface PatientFieldsProps {
  values: PatientFormValues
  errors: PatientFormErrors
  onChange: (field: keyof PatientFormValues, value: string) => void
}

export default function PatientFields({ values, errors, onChange }: PatientFieldsProps) {
  const [today] = useState(() => new Date().toISOString().slice(0, 10))

  function bind(id: keyof PatientFormValues) {
    return {
      value: values[id],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        onChange(id, e.target.value),
    }
  }

  return (
    <>
      <TextField label="Full name" autoComplete="off" error={errors.name} {...bind('name')} />

      <DateField
        label="Date of birth"
        value={values.dateOfBirth}
        onChange={(value) => onChange('dateOfBirth', value)}
        maxDate={today}
        startLevel="decade"
        error={errors.dateOfBirth}
      />

      <SelectField
        label="Gender"
        placeholder="Select a gender"
        options={GENDERS}
        error={errors.gender}
        {...bind('gender')}
      />

      <TextField
        label="Phone"
        type="tel"
        autoComplete="off"
        error={errors.phone}
        {...bind('phone')}
      />

      <TextField
        label="Member ID"
        hint="5 to 12 letters or numbers, saved in upper case."
        autoComplete="off"
        maxLength={12}
        error={errors.memberId}
        {...bind('memberId')}
      />
    </>
  )
}
