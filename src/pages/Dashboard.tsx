import { useQuery } from '@tanstack/react-query'
import { fetchDashboard, type Dashboard as DashboardData } from '../api/dashboard.ts'
import { formatDate, money, percent } from '../app/format.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import Link from '../components/Link.tsx'
import Loader from '../components/Loader.tsx'
import StatCard from '../components/StatCard.tsx'
import StatusBadge from '../components/StatusBadge.tsx'
import { PlusIcon } from '../components/icons.tsx'
import { ButtonLink, TextButton } from '../components/ui/index.ts'

function ClaimsByPayer({ rows }: { rows: DashboardData['byPayer'] }) {
  const max = Math.max(...rows.map((r) => r.claims), 1)
  return (
    <section className="panel" aria-labelledby="by-payer-title">
      <div className="panel__head">
        <h2 id="by-payer-title">Claims by payer</h2>
        <p className="legend">
          <span className="legend__item">
            <span className="swatch swatch--paid" aria-hidden="true" />
            Paid / pending
          </span>
          <span className="legend__item">
            <span className="swatch swatch--denied" aria-hidden="true" />
            Denied
          </span>
        </p>
      </div>
      <ul className="payer-list">
        {rows.map((row) => {
          const okCount = row.claims - row.denied
          return (
            <li key={row.payer}>
              <div className="payer-list__row">
                <strong>{row.payer}</strong>
                <span>
                  {row.claims} claims{row.denied > 0 && ` · ${row.denied} denied`}
                </span>
              </div>
              <div
                className="bar"
                style={{ width: `${(row.claims / max) * 100}%` }}
                role="img"
                aria-label={`${row.payer}: ${okCount} paid or pending, ${row.denied} denied`}
              >
                <span className="bar__ok" style={{ flexGrow: okCount }} />
                <span className="bar__denied" style={{ flexGrow: row.denied }} />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function BilledVsCollected({ data }: { data: DashboardData }) {
  const { billed, collected } = data.totals
  const rate = billed > 0 ? collected / billed : 0
  return (
    <section className="panel" aria-labelledby="billed-title">
      <h2 id="billed-title">Billed vs collected</h2>
      <dl className="money">
        <div>
          <dt>Billed</dt>
          <dd>{money.format(billed)}</dd>
        </div>
        <div>
          <dt className="money__collected">Collected</dt>
          <dd className="money__collected">{money.format(collected)}</dd>
        </div>
        <div>
          <dt>Collection rate</dt>
          <dd>{percent.format(rate)}</dd>
        </div>
      </dl>
      <div
        className="progress"
        role="progressbar"
        aria-label="Collection rate"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(rate * 100)}
      >
        <span style={{ width: `${rate * 100}%` }} />
      </div>

      <h3>Denial reasons</h3>
      <ul className="reasons">
        {data.denialReasons.map((r) => (
          <li key={r.claimId}>
            <strong>{r.reason}</strong>
            <span>
              {r.claimId} · {r.payer}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function RecentClaims({ rows }: { rows: DashboardData['recentClaims'] }) {
  return (
    <section className="panel" aria-labelledby="recent-title">
      <div className="panel__head">
        <h2 id="recent-title">Recent claims</h2>
        <Link to="/claims" className="link">
          View all claims
        </Link>
      </div>
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Claim</th>
              <th scope="col">Patient</th>
              <th scope="col">Payer</th>
              <th scope="col">Service date</th>
              <th scope="col" className="num">
                Billed
              </th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <th scope="row">{c.id}</th>
                <td>{c.patient}</td>
                <td>{c.payer}</td>
                <td>{formatDate(c.serviceDate)}</td>
                <td className="num">{money.format(c.billed)}</td>
                <td>
                  <StatusBadge status={c.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function Dashboard() {
  const { session } = useAuth()
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  })
  const firstName = session?.name.split(' ')[0] ?? ''

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="page-head__sub">
            Welcome back, {firstName}.
            {data && ` Here’s where all ${data.totals.claims} claims stand today.`}
          </p>
        </div>
        <ButtonLink to="/claims/new" icon={<PlusIcon />}>
          New claim
        </ButtonLink>
      </header>

      {isPending && <Loader label="Loading dashboard…" />}
      {isError && (
        <p className="alert" role="alert">
          Could not load the dashboard.{' '}
          <TextButton onClick={() => void refetch()}>Try again</TextButton>
        </p>
      )}
      {data && (
        <div className="dashboard">
          <div className="stats">
            <StatCard
              label="Total claims"
              value={String(data.totals.claims)}
              detail={`${money.format(data.totals.billed)} billed`}
            />
            <StatCard
              label="Paid"
              tone="paid"
              value={String(data.totals.paid)}
              detail={`${money.format(data.totals.collected)} collected`}
            />
            <StatCard
              label="Denied"
              tone="denied"
              value={String(data.totals.denied)}
              detail={
                <strong>
                  {percent.format(data.totals.denied / data.totals.claims)} denial rate
                </strong>
              }
            />
            <StatCard
              label="Pending"
              tone="pending"
              value={String(data.totals.submitted + data.totals.resubmitted)}
              detail={`${data.totals.submitted} submitted · ${data.totals.resubmitted} resubmitted · ${money.format(data.totals.pendingAmount)}`}
            />
          </div>

          <div className="dashboard__mid">
            <ClaimsByPayer rows={data.byPayer} />
            <BilledVsCollected data={data} />
          </div>

          <RecentClaims rows={data.recentClaims} />
        </div>
      )}
    </>
  )
}
