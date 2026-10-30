import { z } from 'zod'
import { fetchClaims } from './claims.ts'

const payerSchema = z.object({
  name: z.string(),
  code: z.string(),
  contact: z.string(),
})

export type SamplePayer = z.infer<typeof payerSchema>
export type Payer = SamplePayer & {
  claims: number
  denied: number
  billed: number
  collected: number
}

// Sample data until the backend payers endpoint exists; replace with a real API call.
const SAMPLE_PAYERS: SamplePayer[] = [
  { name: 'Medicare', code: 'MCR', contact: '+1-555-0101' },
  { name: 'Medicaid', code: 'MCD', contact: '+1-555-0102' },
  { name: 'Aetna', code: 'AET', contact: '+1-555-0103' },
  { name: 'Blue Cross', code: 'BCBS', contact: '+1-555-0104' },
  { name: 'UnitedHealthcare', code: 'UHC', contact: '+1-555-0105' },
]

// In-memory store so payers created in this session show up everywhere.
const payerStore: SamplePayer[] = [...SAMPLE_PAYERS]

export function getPayerDirectory(): SamplePayer[] {
  return [...payerStore]
}

export async function fetchPayers(): Promise<Payer[]> {
  const claims = await fetchClaims()
  const payers = z.array(payerSchema).parse(payerStore)
  return payers.map((payer) => {
    const own = claims.filter((c) => c.payer === payer.name)
    return {
      ...payer,
      claims: own.length,
      denied: own.filter((c) => c.status === 'Denied').length,
      billed: own.reduce((sum, c) => sum + c.billed, 0),
      collected: own.reduce((sum, c) => sum + (c.paid ?? 0), 0),
    }
  })
}

export class PayerConflictError extends Error {
  readonly field: 'name' | 'code'

  constructor(field: 'name' | 'code', message: string) {
    super(message)
    this.field = field
  }
}

export interface NewPayerInput {
  name: string
  code: string
  contact: string
}

export async function createPayer(input: NewPayerInput): Promise<SamplePayer> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const payer = payerSchema.parse(input)
  if (payerStore.some((p) => p.name.toLowerCase() === payer.name.toLowerCase())) {
    throw new PayerConflictError('name', 'A payer with this name already exists.')
  }
  if (payerStore.some((p) => p.code === payer.code)) {
    throw new PayerConflictError('code', 'A payer with this code already exists.')
  }
  payerStore.push(payer)
  return payer
}
