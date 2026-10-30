import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { createClaim } from '../api/claims.ts'
import { fetchLookups } from '../api/lookups.ts'
import { useRouter } from '../app/router.ts'
import Loader from '../components/Loader.tsx'
import {
  Button,
  DateField,
  FormActions,
  SelectField,
  TextAreaField,
  TextButton,
  TextField,
} from '../components/ui/index.ts'

interface FormValues {
  patient: string
  payer: string
  serviceDate: string
  billed: string
  cpt: string
  icd: string
  notes: string
}

type FormErrors = Partial<Record<Exclude<keyof FormValues, 'notes'>, string>>

const EMPTY: FormValues = {
  patient: '',
  payer: '',
  serviceDate: '',
  billed: '',
  cpt: '',
  icd: '',
  notes: '',
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.patient) errors.patient = 'Select a patient.'
  if (!values.payer) errors.payer = 'Select a payer.'
  if (!values.serviceDate) errors.serviceDate = 'Enter the service date.'
  const billed = Number(values.billed)
  if (!values.billed.trim()) errors.billed = 'Enter the billed amount.'
  else if (!Number.isFinite(billed) || billed <= 0) {
    errors.billed = 'Billed amount must be greater than zero.'
  }
  if (!values.cpt.trim()) errors.cpt = 'Enter the CPT code.'
  if (!values.icd.trim()) errors.icd = 'Enter the ICD code.'
  return errors
}

export default function ClaimForm() {
  const { navigate } = useRouter()
  const queryClient = useQueryClient()
  const lookups = useQuery({ queryKey: ['lookups'], queryFn: fetchLookups })
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<FormErrors>({})

  const create = useMutation({
    mutationFn: createClaim,
    onSuccess: async (claim) => {
      await queryClient.invalidateQueries({ queryKey: ['claims'], refetchType: 'all' })
      navigate(`/claims/${claim.id}`)
    },
  })

  function bind(id: keyof FormValues) {
    return {
      value: values[id],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setValues((prev) => ({ ...prev, [id]: e.target.value })),
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    create.mutate({
      patient: values.patient,
      payer: values.payer,
      serviceDate: values.serviceDate,
      billed: Number(values.billed),
      cpt: values.cpt.trim(),
      icd: values.icd.trim(),
      notes: values.notes,
    })
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>New claim</h1>
          <p className="page-head__sub">
            Create a claim for a patient visit. It is saved with status Submitted.
          </p>
        </div>
      </header>

      <div className="new-claim">
        <section className="panel" aria-label="New claim form">
          {lookups.isPending && <Loader label="Loading form…" />}
          {lookups.isError && (
            <p className="alert" role="alert">
              Could not load patients and payers.{' '}
              <TextButton onClick={() => void lookups.refetch()}>Try again</TextButton>
            </p>
          )}
          {lookups.data && (
            <form className="claim-form" onSubmit={handleSubmit} noValidate>
              {create.isError && (
                <p className="alert form-field--wide" role="alert">
                  Could not create the claim. Try again.
                </p>
              )}

              <SelectField
                label="Patient"
                placeholder="Select a patient"
                options={lookups.data.patients}
                error={errors.patient}
                {...bind('patient')}
              />

              <SelectField
                label="Payer (insurance)"
                placeholder="Select a payer"
                options={lookups.data.payers}
                error={errors.payer}
                {...bind('payer')}
              />

              <DateField
                label="Service date"
                value={values.serviceDate}
                onChange={(serviceDate) => setValues((prev) => ({ ...prev, serviceDate }))}
                error={errors.serviceDate}
              />

              <TextField
                label="Billed amount (USD)"
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="e.g. 180.00"
                error={errors.billed}
                {...bind('billed')}
              />

              <TextField
                label="CPT code (procedure)"
                placeholder="e.g. 99213"
                autoComplete="off"
                error={errors.cpt}
                {...bind('cpt')}
              />

              <TextField
                label="ICD code (diagnosis)"
                placeholder="e.g. E11.9"
                autoComplete="off"
                error={errors.icd}
                {...bind('icd')}
              />

              <TextAreaField
                label="Notes"
                optional
                wide
                rows={3}
                placeholder="Anything the team should know about this claim"
                {...bind('notes')}
              />

              <FormActions wide>
                <Button type="submit" loading={create.isPending}>
                  {create.isPending ? 'Creating…' : 'Create claim'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/claims')}
                  disabled={create.isPending}
                >
                  Cancel
                </Button>
              </FormActions>
            </form>
          )}
        </section>

        <aside className="panel next-steps" aria-labelledby="next-title">
          <h2 id="next-title">What happens next</h2>
          <ol>
            <li>
              The claim is saved as <strong>Submitted</strong> and appears in the claims list.
            </li>
            <li>
              When the payer replies, open the claim and mark it <strong>Paid</strong> or{' '}
              <strong>Denied</strong>.
            </li>
            <li>
              A denial needs a reason. After fixing it, <strong>Resubmit</strong> the claim.
            </li>
          </ol>
          <p className="next-steps__note">
            The API rejects a billed amount of zero or less, and every required field is checked
            before saving.
          </p>
        </aside>
      </div>
    </>
  )
}
