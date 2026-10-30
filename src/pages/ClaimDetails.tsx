import { useQuery } from '@tanstack/react-query'
import { ClaimNotFoundError, fetchClaimDetail, type ClaimDetail } from '../api/claimDetail.ts'
import { formatDate, money } from '../app/format.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import Link from '../components/Link.tsx'
import Loader from '../components/Loader.tsx'
import StatusBadge from '../components/StatusBadge.tsx'
import { ArrowLeftIcon, TrashIcon } from '../components/icons.tsx'
import { Button, TextButton } from '../components/ui/index.ts'

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="field-pair">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function BackLink() {
  return (
    <Link to="/claims" className="back-link">
      <ArrowLeftIcon />
      Back to claims
    </Link>
  )
}

function Details({ claim }: { claim: ClaimDetail }) {
  return (
    <section className="panel" aria-labelledby="details-title">
      <h2 id="details-title">Claim details</h2>
      <dl className="field-grid">
        <Field label="Service date" value={formatDate(claim.serviceDate)} />
        <Field label="CPT code (procedure)" value={claim.cpt} />
        <Field label="ICD code (diagnosis)" value={claim.icd} />
        <Field label="Billed amount" value={money.format(claim.billed)} />
        <Field label="Paid amount" value={claim.paid === null ? '—' : money.format(claim.paid)} />
        <Field label="Entered by" value={claim.enteredBy} />
        {claim.notes && <Field label="Notes" value={claim.notes} />}
      </dl>
    </section>
  )
}

function PatientCard({ patient }: { patient: ClaimDetail['patient'] }) {
  return (
    <section className="panel" aria-labelledby="patient-title">
      <h2 id="patient-title">Patient</h2>
      <div className="person">
        <span className="person__badge person__badge--round" aria-hidden="true">
          {initials(patient.name)}
        </span>
        <div>
          <strong>{patient.name}</strong>
          <small>
            {patient.gender} · Born {formatDate(patient.dateOfBirth)}
          </small>
        </div>
      </div>
      <p className="person__line">
        Member ID: <strong>{patient.memberId}</strong>
      </p>
      <p className="person__line">Phone: {patient.phone}</p>
    </section>
  )
}

function PayerCard({ payer }: { payer: ClaimDetail['payer'] }) {
  return (
    <section className="panel" aria-labelledby="payer-title">
      <h2 id="payer-title">Payer</h2>
      <div className="person">
        <span className="person__badge person__badge--square" aria-hidden="true">
          {payer.code}
        </span>
        <div>
          <strong>{payer.name}</strong>
          <small>Payer code {payer.code}</small>
        </div>
      </div>
      <p className="person__line">Contact: {payer.contact}</p>
    </section>
  )
}

function UpdateStatus({ status }: { status: ClaimDetail['status'] }) {
  const open = status === 'Submitted' || status === 'Resubmitted'
  return (
    <section className="panel" aria-labelledby="status-title">
      <h2 id="status-title">Update status</h2>
      {open ? (
        <>
          <p className="panel__hint">Record the insurance company&rsquo;s decision.</p>
          <div className="actions">
            <Button fullWidth>Mark paid</Button>
            <Button variant="danger" fullWidth>
              Deny
            </Button>
          </div>
        </>
      ) : (
        <p className="panel__hint">
          This claim is <StatusBadge status={status} />.
        </p>
      )}
    </section>
  )
}

function Activity({ items }: { items: ClaimDetail['activity'] }) {
  return (
    <section className="panel" aria-labelledby="activity-title">
      <h2 id="activity-title">Activity</h2>
      <ol className="activity">
        {items.map((item) => (
          <li key={item.text}>
            <strong>{item.text}</strong>
            <small>{item.date ? `${item.by} · ${formatDate(item.date)}` : item.by}</small>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function ClaimDetails({ id }: { id: string }) {
  const { session } = useAuth()
  const { data, error, isPending, isError, refetch } = useQuery({
    queryKey: ['claim', id],
    queryFn: () => fetchClaimDetail(id),
    retry: (count, err) => !(err instanceof ClaimNotFoundError) && count < 2,
  })

  if (isPending) {
    return (
      <>
        <BackLink />
        <Loader label="Loading claim…" />
      </>
    )
  }

  if (isError) {
    const notFound = error instanceof ClaimNotFoundError
    return (
      <>
        <BackLink />
        <p className="alert" role="alert">
          {notFound ? `Claim ${id} was not found.` : 'Could not load this claim.'}{' '}
          {!notFound && <TextButton onClick={() => void refetch()}>Try again</TextButton>}
        </p>
      </>
    )
  }

  return (
    <>
      <BackLink />
      <header className="page-head page-head--center">
        <h1 className="claim-title">
          {data.id}
          <StatusBadge status={data.status} />
        </h1>
        {session?.role === 'Admin' && (
          <Button variant="danger" size="sm" icon={<TrashIcon />}>
            Delete claim
          </Button>
        )}
      </header>

      <div className="claim-layout">
        <div className="claim-layout__main">
          <Details claim={data} />
          <div className="claim-layout__people">
            <PatientCard patient={data.patient} />
            <PayerCard payer={data.payer} />
          </div>
        </div>
        <div className="claim-layout__side">
          <UpdateStatus status={data.status} />
          <Activity items={data.activity} />
        </div>
      </div>
    </>
  )
}
