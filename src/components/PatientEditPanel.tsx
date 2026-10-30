import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { PatientConflictError, updatePatient, type Patient } from '../api/patients.ts'
import {
  normalizePatient,
  validatePatient,
  type PatientFormErrors,
  type PatientFormValues,
} from '../app/patientForm.ts'
import PatientFields from './PatientFields.tsx'
import SidePanel from './SidePanel.tsx'
import { Button, FormActions } from './ui/index.ts'

interface PatientEditPanelProps {
  patient: Patient
  onClose: () => void
}

export default function PatientEditPanel({ patient, onClose }: PatientEditPanelProps) {
  const queryClient = useQueryClient()
  const [values, setValues] = useState<PatientFormValues>({
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    phone: patient.phone,
    memberId: patient.memberId,
  })
  const [errors, setErrors] = useState<PatientFormErrors>({})

  const save = useMutation({
    mutationFn: (input: PatientFormValues) => updatePatient(patient.memberId, input),
    onSuccess: async () => {
      await Promise.all(
        ['patients', 'claims', 'lookups'].map((key) =>
          queryClient.invalidateQueries({ queryKey: [key], refetchType: 'all' }),
        ),
      )
      onClose()
    },
    onError: (error) => {
      if (error instanceof PatientConflictError) setErrors({ [error.field]: error.message })
    },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validatePatient(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    save.mutate(normalizePatient(values))
  }

  const unexpectedError = save.isError && !(save.error instanceof PatientConflictError)

  return (
    <SidePanel
      title="Edit patient"
      subtitle={`${patient.claims} ${patient.claims === 1 ? 'claim' : 'claims'} on file`}
      onClose={onClose}
    >
      <form className="panel-form" onSubmit={handleSubmit} noValidate>
        {unexpectedError && (
          <p className="alert" role="alert">
            Could not save the patient. Try again.
          </p>
        )}

        <PatientFields
          values={values}
          errors={errors}
          onChange={(field, value) => setValues((prev) => ({ ...prev, [field]: value }))}
        />

        <FormActions>
          <Button type="submit" loading={save.isPending}>
            {save.isPending ? 'Saving…' : 'Save changes'}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={save.isPending}>
            Cancel
          </Button>
        </FormActions>
      </form>
    </SidePanel>
  )
}
