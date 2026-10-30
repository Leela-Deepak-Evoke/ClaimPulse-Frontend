import { z } from 'zod'

const dashboardSchema = z.object({
  totals: z.object({
    claims: z.number(),
    billed: z.number(),
    collected: z.number(),
    paid: z.number(),
    denied: z.number(),
    submitted: z.number(),
    resubmitted: z.number(),
    pendingAmount: z.number(),
  }),
  byPayer: z.array(z.object({ payer: z.string(), claims: z.number(), denied: z.number() })),
  denialReasons: z.array(z.object({ reason: z.string(), claimId: z.string(), payer: z.string() })),
  recentClaims: z.array(
    z.object({
      id: z.string(),
      patient: z.string(),
      payer: z.string(),
      serviceDate: z.string(),
      billed: z.number(),
      status: z.enum(['Submitted', 'Paid', 'Denied', 'Resubmitted']),
    }),
  ),
})

export type Dashboard = z.infer<typeof dashboardSchema>

// Sample data until the backend dashboard endpoint exists; replace with a real API call.
const SAMPLE_DASHBOARD = {
  totals: {
    claims: 15,
    billed: 7110,
    collected: 4267.4,
    paid: 5,
    denied: 5,
    submitted: 4,
    resubmitted: 1,
    pendingAmount: 1000,
  },
  byPayer: [
    { payer: 'Medicare', claims: 4, denied: 3 },
    { payer: 'Aetna', claims: 3, denied: 0 },
    { payer: 'Blue Cross', claims: 3, denied: 2 },
    { payer: 'UnitedHealthcare', claims: 3, denied: 0 },
    { payer: 'Medicaid', claims: 2, denied: 0 },
  ],
  denialReasons: [
    { reason: 'Missing information', claimId: 'CLM-0003', payer: 'Blue Cross' },
    { reason: 'Coding error', claimId: 'CLM-0005', payer: 'Medicare' },
    { reason: 'Expired eligibility', claimId: 'CLM-0008', payer: 'Blue Cross' },
    { reason: 'Duplicate claim', claimId: 'CLM-0011', payer: 'Medicare' },
    { reason: 'Not covered', claimId: 'CLM-0014', payer: 'Medicare' },
  ],
  recentClaims: [
    {
      id: 'CLM-0015',
      patient: 'Sophia Martinez',
      payer: 'UnitedHealthcare',
      serviceDate: '2026-09-15',
      billed: 240,
      status: 'Submitted',
    },
    {
      id: 'CLM-0014',
      patient: 'David Wilson',
      payer: 'Medicare',
      serviceDate: '2026-09-12',
      billed: 260,
      status: 'Denied',
    },
    {
      id: 'CLM-0013',
      patient: 'Michael Brown',
      payer: 'Blue Cross',
      serviceDate: '2026-09-08',
      billed: 150,
      status: 'Submitted',
    },
    {
      id: 'CLM-0012',
      patient: 'Emily Johnson',
      payer: 'Aetna',
      serviceDate: '2026-09-05',
      billed: 180,
      status: 'Paid',
    },
    {
      id: 'CLM-0011',
      patient: 'John Carter',
      payer: 'Medicare',
      serviceDate: '2026-09-02',
      billed: 60,
      status: 'Denied',
    },
  ],
}

export async function fetchDashboard(): Promise<Dashboard> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return dashboardSchema.parse(SAMPLE_DASHBOARD)
}
