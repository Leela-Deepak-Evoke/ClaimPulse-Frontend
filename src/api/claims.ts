import { z } from 'zod'

export const CLAIM_STATUSES = ['Submitted', 'Paid', 'Denied', 'Resubmitted'] as const

const claimSchema = z.object({
  id: z.string(),
  patient: z.string(),
  payer: z.string(),
  serviceDate: z.string(),
  cpt: z.string(),
  icd: z.string(),
  billed: z.number(),
  paid: z.number().nullable(),
  status: z.enum(CLAIM_STATUSES),
  denialReason: z.string().nullable(),
  notes: z.string().nullable(),
})

export type Claim = z.infer<typeof claimSchema>

type SampleRow = [
  id: string,
  patient: string,
  payer: string,
  serviceDate: string,
  cpt: string,
  icd: string,
  billed: number,
  paid: number | null,
  status: Claim['status'],
  denialReason: string | null,
]

// Sample data until the backend claims endpoint exists; replace with a real API call.
const SAMPLE_ROWS: SampleRow[] = [
  ['CLM-0001', 'John Carter', 'Medicare', '2026-08-04', '99213', 'E11.9', 180, 152.4, 'Paid', null],
  [
    'CLM-0002',
    'Emily Johnson',
    'Aetna',
    '2026-08-06',
    '99203',
    'J06.9',
    220,
    null,
    'Submitted',
    null,
  ],
  [
    'CLM-0003',
    'Michael Brown',
    'Blue Cross',
    '2026-08-09',
    '71046',
    'R05.9',
    310,
    null,
    'Denied',
    'Missing information',
  ],
  [
    'CLM-0004',
    'Sophia Martinez',
    'UnitedHealthcare',
    '2026-08-11',
    '80053',
    'Z00.00',
    145,
    120,
    'Paid',
    null,
  ],
  [
    'CLM-0005',
    'David Wilson',
    'Medicare',
    '2026-08-13',
    '93000',
    'I10',
    95,
    null,
    'Denied',
    'Coding error',
  ],
  [
    'CLM-0006',
    'Olivia Davis',
    'Medicaid',
    '2026-08-15',
    '99214',
    'F41.1',
    260,
    null,
    'Submitted',
    null,
  ],
  [
    'CLM-0007',
    'James Anderson',
    'Aetna',
    '2026-08-18',
    '29881',
    'M23.21',
    4200,
    3650,
    'Paid',
    null,
  ],
  [
    'CLM-0008',
    'Ava Thompson',
    'Blue Cross',
    '2026-08-20',
    '76805',
    'Z34.90',
    480,
    null,
    'Denied',
    'Expired eligibility',
  ],
  [
    'CLM-0009',
    'Robert Garcia',
    'UnitedHealthcare',
    '2026-08-22',
    '99212',
    'J45.909',
    130,
    null,
    'Resubmitted',
    null,
  ],
  ['CLM-0010', 'Mia Robinson', 'Medicaid', '2026-08-25', '90834', 'F32.9', 200, 185, 'Paid', null],
  [
    'CLM-0011',
    'John Carter',
    'Medicare',
    '2026-09-02',
    '83036',
    'E11.9',
    60,
    null,
    'Denied',
    'Duplicate claim',
  ],
  ['CLM-0012', 'Emily Johnson', 'Aetna', '2026-09-05', '99213', 'J02.9', 180, 160, 'Paid', null],
  [
    'CLM-0013',
    'Michael Brown',
    'Blue Cross',
    '2026-09-08',
    '97110',
    'M54.5',
    150,
    null,
    'Submitted',
    null,
  ],
  [
    'CLM-0014',
    'David Wilson',
    'Medicare',
    '2026-09-12',
    '99214',
    'I10',
    260,
    null,
    'Denied',
    'Not covered',
  ],
  [
    'CLM-0015',
    'Sophia Martinez',
    'UnitedHealthcare',
    '2026-09-15',
    '99395',
    'Z00.00',
    240,
    null,
    'Submitted',
    null,
  ],
]

const SAMPLE_CLAIMS = SAMPLE_ROWS.map(
  ([id, patient, payer, serviceDate, cpt, icd, billed, paid, status, denialReason]) => ({
    id,
    patient,
    payer,
    serviceDate,
    cpt,
    icd,
    billed,
    paid,
    status,
    denialReason,
    notes: null,
  }),
)

// In-memory store so claims created in this session show up in the list and details.
const claimStore: Claim[] = [...SAMPLE_CLAIMS]

export async function fetchClaims(): Promise<Claim[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return z.array(claimSchema).parse(claimStore)
}

export function renamePatientOnClaims(from: string, to: string): void {
  for (const claim of claimStore) {
    if (claim.patient === from) claim.patient = to
  }
}

export interface NewClaimInput {
  patient: string
  payer: string
  serviceDate: string
  billed: number
  cpt: string
  icd: string
  notes: string
}

export async function createClaim(input: NewClaimInput): Promise<Claim> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const claim = claimSchema.parse({
    id: `CLM-${String(claimStore.length + 1).padStart(4, '0')}`,
    patient: input.patient,
    payer: input.payer,
    serviceDate: input.serviceDate,
    cpt: input.cpt,
    icd: input.icd,
    billed: input.billed,
    paid: null,
    status: 'Submitted',
    denialReason: null,
    notes: input.notes.trim() || null,
  })
  claimStore.push(claim)
  return claim
}
