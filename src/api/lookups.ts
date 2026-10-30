import { getPatientDirectory } from './patients.ts'
import { getPayerDirectory } from './payers.ts'

export interface Lookups {
  patients: string[]
  payers: string[]
}

// Sample lists until the backend patient and payer endpoints exist.
export async function fetchLookups(): Promise<Lookups> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return {
    patients: getPatientDirectory().map((p) => p.name),
    payers: getPayerDirectory().map((p) => p.name),
  }
}
