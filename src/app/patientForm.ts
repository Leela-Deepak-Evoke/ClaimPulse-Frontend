import { PHONE_PATTERN } from './validation.ts'

export const GENDERS = ['Male', 'Female', 'Other']

const MEMBER_ID_PATTERN = /^[A-Z0-9]{5,12}$/

export interface PatientFormValues {
  name: string
  dateOfBirth: string
  gender: string
  phone: string
  memberId: string
}

export type PatientFormErrors = Partial<Record<keyof PatientFormValues, string>>

export const EMPTY_PATIENT_FORM: PatientFormValues = {
  name: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  memberId: '',
}

export function validatePatient(values: PatientFormValues): PatientFormErrors {
  const errors: PatientFormErrors = {}
  if (!values.name.trim()) errors.name = 'Enter the patient name.'
  if (!values.dateOfBirth) errors.dateOfBirth = 'Enter the date of birth.'
  else if (values.dateOfBirth > new Date().toISOString().slice(0, 10)) {
    errors.dateOfBirth = 'Date of birth cannot be in the future.'
  }
  if (!values.gender) errors.gender = 'Select a gender.'
  const phone = values.phone.trim()
  if (!phone) errors.phone = 'Enter a phone number.'
  else if (!PHONE_PATTERN.test(phone)) errors.phone = 'Enter a valid phone number.'
  const memberId = values.memberId.trim().toUpperCase()
  if (!memberId) errors.memberId = 'Enter the member ID.'
  else if (!MEMBER_ID_PATTERN.test(memberId)) errors.memberId = 'Use 5 to 12 letters or numbers.'
  return errors
}

export function normalizePatient(values: PatientFormValues): PatientFormValues {
  return {
    name: values.name.trim(),
    dateOfBirth: values.dateOfBirth,
    gender: values.gender,
    phone: values.phone.trim(),
    memberId: values.memberId.trim().toUpperCase(),
  }
}
