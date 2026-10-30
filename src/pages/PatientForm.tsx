import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { createPatient, PatientConflictError } from '../api/patients.ts'
import {
  EMPTY_PATIENT_FORM,
  normalizePatient,
  validatePatient,
  type PatientFormErrors,
  type PatientFormValues,
} from '../app/patientForm.ts'
import { useRouter } from '../app/router.ts'
import Link from '../components/Link.tsx'
import PatientFields from '../components/PatientFields.tsx'
import { ArrowLeftIcon } from '../components/icons.tsx'
import { Button, FormActions } from '../components/ui/index.ts'

export default function PatientForm() {
  const { navigate } = useRouter()
  const queryClient = useQueryClient()
  const [values, setValues] = useState<PatientFormValues>(EMPTY_PATIENT_FORM)
  const [errors, setErrors] = useState<PatientFormErrors>({})

  const create = useMutation({
    mutationFn: createPatient,
    onSuccess: async () => {
      await Promise.all(
        ['patients', 'lookups'].map((key) =>
          queryClient.invalidateQueries({ queryKey: [key], refetchType: 'all' }),
        ),
      )
      navigate('/patients')
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
    create.mutate(normalizePatient(values))
  }

  const unexpectedError = create.isError && !(create.error instanceof PatientConflictError)

  return (
    <>
      <Link to="/patients" className="back-link">
        <ArrowLeftIcon />
        Back to patients
      </Link>
      <header className="page-head">
        <div>
          <h1>Add patient</h1>
          <p className="page-head__sub">Add a person whose visits are billed to insurance.</p>
        </div>
      </header>

      <div className="new-claim">
        <section className="panel" aria-label="Add patient form">
          <form className="claim-form" onSubmit={handleSubmit} noValidate>
            {unexpectedError && (
              <p className="alert form-field--wide" role="alert">
                Could not add the patient. Try again.
              </p>
            )}

            <PatientFields
              values={values}
              errors={errors}
              onChange={(field, value) => setValues((prev) => ({ ...prev, [field]: value }))}
            />

            <FormActions wide>
              <Button type="submit" loading={create.isPending}>
                {create.isPending ? 'Adding…' : 'Add patient'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/patients')}
                disabled={create.isPending}
              >
                Cancel
              </Button>
            </FormActions>
          </form>
        </section>

        <aside className="panel next-steps" aria-labelledby="patient-next-title">
          <h2 id="patient-next-title">What happens next</h2>
          <ol>
            <li>The patient appears on the Patients page with zero claims.</li>
            <li>They become available in the patient list when you create a claim.</li>
          </ol>
          <p className="next-steps__note">
            Patient names and member IDs must be unique, because claims are matched to patients by
            name.
          </p>
        </aside>
      </div>
    </>
  )
}
