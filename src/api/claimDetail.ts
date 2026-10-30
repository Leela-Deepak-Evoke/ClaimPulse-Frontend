import { z } from 'zod'
import { fetchClaims, type Claim } from './claims.ts'
import { getPatientDirectory, type SamplePatient } from './patients.ts'
import { getPayerDirectory } from './payers.ts'

const claimDetailSchema = z.object({
  id: z.string(),
  status: z.enum(['Submitted', 'Paid', 'Denied', 'Resubmitted']),
  serviceDate: z.string(),
  cpt: z.string(),
  icd: z.string(),
  billed: z.number(),
  paid: z.number().nullable(),
  denialReason: z.string().nullable(),
  enteredBy: z.string(),
  notes: z.string().nullable(),
  patient: z.object({
    name: z.string(),
    gender: z.string(),
    dateOfBirth: z.string(),
    memberId: z.string(),
    phone: z.string(),
  }),
  payer: z.object({ name: z.string(), code: z.string(), contact: z.string() }),
  activity: z.array(z.object({ text: z.string(), by: z.string(), date: z.string().nullable() })),
})

export type ClaimDetail = z.infer<typeof claimDetailSchema>

export class ClaimNotFoundError extends Error {}

const ENTERED_BY = 'Priya Nair'
const FALLBACK_PATIENT: SamplePatient = {
  name: '—',
  dateOfBirth: '1900-01-01',
  gender: '—',
  phone: '—',
  memberId: '—',
}
const FALLBACK_PAYER = { code: '—', contact: '—' }

function buildActivity(claim: Claim): ClaimDetail['activity'] {
  const events: ClaimDetail['activity'] = [
    {
      text: `Claim submitted to ${claim.payer}`,
      by: ENTERED_BY,
      date: claim.serviceDate,
    },
  ]
  if (claim.status === 'Paid') {
    events.push({ text: 'Payment recorded', by: ENTERED_BY, date: null })
  } else if (claim.status === 'Denied' || claim.status === 'Resubmitted') {
    events.push({
      text: `Claim denied${claim.denialReason ? `: ${claim.denialReason}` : ''}`,
      by: ENTERED_BY,
      date: null,
    })
    if (claim.status === 'Resubmitted') {
      events.push({ text: `Claim resubmitted to ${claim.payer}`, by: ENTERED_BY, date: null })
    }
  }
  return events
}

export async function fetchClaimDetail(id: string): Promise<ClaimDetail> {
  const claims = await fetchClaims()
  const claim = claims.find((c) => c.id === id)
  if (!claim) throw new ClaimNotFoundError(`Claim ${id} not found`)

  const patient = getPatientDirectory().find((p) => p.name === claim.patient) ?? FALLBACK_PATIENT
  const payer = getPayerDirectory().find((p) => p.name === claim.payer) ?? FALLBACK_PAYER

  return claimDetailSchema.parse({
    id: claim.id,
    status: claim.status,
    serviceDate: claim.serviceDate,
    cpt: claim.cpt,
    icd: claim.icd,
    billed: claim.billed,
    paid: claim.paid,
    denialReason: claim.denialReason,
    enteredBy: ENTERED_BY,
    notes: claim.notes,
    patient: {
      name: claim.patient,
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth,
      memberId: patient.memberId,
      phone: patient.phone,
    },
    payer: { name: claim.payer, code: payer.code, contact: payer.contact },
    activity: buildActivity(claim),
  })
}
