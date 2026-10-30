import { z } from 'zod'
import { fetchClaims, renamePatientOnClaims } from './claims.ts'

const patientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  gender: z.string(),
  phone: z.string(),
  memberId: z.string(),
})

export type SamplePatient = z.infer<typeof patientSchema>
export type Patient = SamplePatient & { claims: number }

// Sample data until the backend patients endpoint exists; replace with a real API call.
const SAMPLE_PATIENTS: SamplePatient[] = [
  {
    name: 'John Carter',
    dateOfBirth: '1958-03-14',
    gender: 'Male',
    phone: '+1-555-0201',
    memberId: 'MCR100234',
  },
  {
    name: 'Emily Johnson',
    dateOfBirth: '1986-07-22',
    gender: 'Female',
    phone: '+1-555-0202',
    memberId: 'AET553201',
  },
  {
    name: 'Michael Brown',
    dateOfBirth: '1972-11-05',
    gender: 'Male',
    phone: '+1-555-0203',
    memberId: 'BCBS77812',
  },
  {
    name: 'Sophia Martinez',
    dateOfBirth: '1994-01-30',
    gender: 'Female',
    phone: '+1-555-0204',
    memberId: 'UHC900145',
  },
  {
    name: 'David Wilson',
    dateOfBirth: '1949-09-18',
    gender: 'Male',
    phone: '+1-555-0205',
    memberId: 'MCR100877',
  },
  {
    name: 'Olivia Davis',
    dateOfBirth: '2001-05-09',
    gender: 'Female',
    phone: '+1-555-0206',
    memberId: 'MCD440219',
  },
  {
    name: 'James Anderson',
    dateOfBirth: '1965-12-27',
    gender: 'Male',
    phone: '+1-555-0207',
    memberId: 'AET553988',
  },
  {
    name: 'Ava Thompson',
    dateOfBirth: '1990-08-16',
    gender: 'Female',
    phone: '+1-555-0208',
    memberId: 'BCBS78034',
  },
  {
    name: 'Robert Garcia',
    dateOfBirth: '1978-04-03',
    gender: 'Male',
    phone: '+1-555-0209',
    memberId: 'UHC900602',
  },
  {
    name: 'Mia Robinson',
    dateOfBirth: '1983-10-11',
    gender: 'Other',
    phone: '+1-555-0210',
    memberId: 'MCD440766',
  },
]

// In-memory store so edits made in this session show up everywhere.
const patientStore: SamplePatient[] = [...SAMPLE_PATIENTS]

export function getPatientDirectory(): SamplePatient[] {
  return [...patientStore]
}

export async function fetchPatients(): Promise<Patient[]> {
  const claims = await fetchClaims()
  const patients = z.array(patientSchema).parse(patientStore)
  return patients.map((p) => ({
    ...p,
    claims: claims.filter((c) => c.patient === p.name).length,
  }))
}

export class PatientNotFoundError extends Error {}

export class PatientConflictError extends Error {
  readonly field: 'name' | 'memberId'

  constructor(field: 'name' | 'memberId', message: string) {
    super(message)
    this.field = field
  }
}

export type PatientInput = SamplePatient

// Claims are matched to patients by name, so names must be unique as well as member IDs.
function assertUnique(patient: SamplePatient, ignoreIndex: number): void {
  const others = patientStore.filter((_, i) => i !== ignoreIndex)
  if (others.some((p) => p.name.toLowerCase() === patient.name.toLowerCase())) {
    throw new PatientConflictError('name', 'A patient with this name already exists.')
  }
  if (others.some((p) => p.memberId === patient.memberId)) {
    throw new PatientConflictError('memberId', 'A patient with this member ID already exists.')
  }
}

export async function createPatient(input: PatientInput): Promise<SamplePatient> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const patient = patientSchema.parse(input)
  assertUnique(patient, -1)
  patientStore.push(patient)
  return patient
}

export async function updatePatient(memberId: string, input: PatientInput): Promise<SamplePatient> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const patient = patientSchema.parse(input)
  const index = patientStore.findIndex((p) => p.memberId === memberId)
  const previous = patientStore[index]
  if (!previous) throw new PatientNotFoundError(`Patient ${memberId} not found`)
  assertUnique(patient, index)
  patientStore[index] = patient
  if (previous.name !== patient.name) renamePatientOnClaims(previous.name, patient.name)
  return patient
}
