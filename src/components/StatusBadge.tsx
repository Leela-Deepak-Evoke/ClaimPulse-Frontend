export type ClaimStatus = 'Submitted' | 'Paid' | 'Denied' | 'Resubmitted'

export default function StatusBadge({ status }: { status: ClaimStatus }) {
  return <span className={`pill pill--${status.toLowerCase()}`}>{status}</span>
}
