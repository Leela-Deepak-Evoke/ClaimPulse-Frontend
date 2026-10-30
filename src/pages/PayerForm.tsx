import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { createPayer, PayerConflictError } from '../api/payers.ts'
import { useRouter } from '../app/router.ts'
import { PHONE_PATTERN } from '../app/validation.ts'
import Link from '../components/Link.tsx'
import { ArrowLeftIcon } from '../components/icons.tsx'
import { Button, FormActions, TextField } from '../components/ui/index.ts'

interface FormValues {
  name: string
  code: string
  contact: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const EMPTY: FormValues = { name: '', code: '', contact: '' }
const CODE_PATTERN = /^[A-Z0-9]{2,6}$/

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.name.trim()) errors.name = 'Enter the payer name.'
  const code = values.code.trim().toUpperCase()
  if (!code) errors.code = 'Enter the payer code.'
  else if (!CODE_PATTERN.test(code)) errors.code = 'Use 2 to 6 letters or numbers.'
  const contact = values.contact.trim()
  if (!contact) errors.contact = 'Enter a contact phone number.'
  else if (!PHONE_PATTERN.test(contact)) errors.contact = 'Enter a valid phone number.'
  return errors
}

export default function PayerForm() {
  const { navigate } = useRouter()
  const queryClient = useQueryClient()
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<FormErrors>({})

  const create = useMutation({
    mutationFn: createPayer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['payers'], refetchType: 'all' })
      await queryClient.invalidateQueries({ queryKey: ['lookups'], refetchType: 'all' })
      navigate('/payers')
    },
    onError: (error) => {
      if (error instanceof PayerConflictError) {
        setErrors({ [error.field]: error.message })
      }
    },
  })

  function bind(id: keyof FormValues) {
    return {
      value: values[id],
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        setValues((prev) => ({ ...prev, [id]: e.target.value })),
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    create.mutate({
      name: values.name.trim(),
      code: values.code.trim().toUpperCase(),
      contact: values.contact.trim(),
    })
  }

  const unexpectedError = create.isError && !(create.error instanceof PayerConflictError)

  return (
    <>
      <Link to="/payers" className="back-link">
        <ArrowLeftIcon />
        Back to payers
      </Link>
      <header className="page-head">
        <div>
          <h1>Add payer</h1>
          <p className="page-head__sub">Add an insurance company you send claims to.</p>
        </div>
      </header>

      <div className="new-claim">
        <section className="panel" aria-label="Add payer form">
          <form className="claim-form" onSubmit={handleSubmit} noValidate>
            {unexpectedError && (
              <p className="alert form-field--wide" role="alert">
                Could not add the payer. Try again.
              </p>
            )}

            <TextField
              label="Payer name"
              placeholder="e.g. Cigna"
              autoComplete="off"
              wide
              error={errors.name}
              {...bind('name')}
            />

            <TextField
              label="Payer code"
              hint="2 to 6 letters or numbers, such as CIG."
              placeholder="e.g. CIG"
              maxLength={6}
              autoComplete="off"
              error={errors.code}
              {...bind('code')}
            />

            <TextField
              label="Contact phone"
              type="tel"
              placeholder="e.g. +1-555-0106"
              autoComplete="off"
              error={errors.contact}
              {...bind('contact')}
            />

            <FormActions wide>
              <Button type="submit" loading={create.isPending}>
                {create.isPending ? 'Adding…' : 'Add payer'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/payers')}
                disabled={create.isPending}
              >
                Cancel
              </Button>
            </FormActions>
          </form>
        </section>

        <aside className="panel next-steps" aria-labelledby="payer-next-title">
          <h2 id="payer-next-title">What happens next</h2>
          <ol>
            <li>The payer appears on the Payers page with zero claims.</li>
            <li>It becomes available in the payer list when you create a claim.</li>
          </ol>
          <p className="next-steps__note">
            Payer names and codes must be unique. Only admins can add payers.
          </p>
        </aside>
      </div>
    </>
  )
}
