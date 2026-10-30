import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { CLAIM_STATUSES, fetchClaims, type Claim } from '../api/claims.ts'
import { formatDate, money } from '../app/format.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import Link from '../components/Link.tsx'
import Loader from '../components/Loader.tsx'
import StatusBadge from '../components/StatusBadge.tsx'
import { InfoIcon, PlusIcon } from '../components/icons.tsx'
import { ButtonLink, FilterChip, SearchField, TextButton } from '../components/ui/index.ts'

type Filter = 'All' | Claim['status']

function matchesSearch(claim: Claim, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return claim.patient.toLowerCase().includes(needle) || claim.id.toLowerCase().includes(needle)
}

export default function Claims() {
  const { session } = useAuth()
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['claims'],
    queryFn: fetchClaims,
  })
  const [filter, setFilter] = useState<Filter>('All')
  const [search, setSearch] = useState('')

  const counts = useMemo(() => {
    const result: Record<Filter, number> = {
      All: data?.length ?? 0,
      Submitted: 0,
      Paid: 0,
      Denied: 0,
      Resubmitted: 0,
    }
    for (const claim of data ?? []) result[claim.status] += 1
    return result
  }, [data])

  const visible = useMemo(
    () =>
      (data ?? []).filter(
        (claim) => (filter === 'All' || claim.status === filter) && matchesSearch(claim, search),
      ),
    [data, filter, search],
  )

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Claims</h1>
          <p className="page-head__sub">Every claim sent to insurance, with its current status.</p>
        </div>
        <ButtonLink to="/claims/new" icon={<PlusIcon />}>
          New claim
        </ButtonLink>
      </header>

      {isPending && <Loader label="Loading claims…" />}
      {isError && (
        <p className="alert" role="alert">
          Could not load claims. <TextButton onClick={() => void refetch()}>Try again</TextButton>
        </p>
      )}
      {data && (
        <>
          <div className="toolbar">
            <div className="chips" role="group" aria-label="Filter by status">
              {(['All', ...CLAIM_STATUSES] as const).map((status) => (
                <FilterChip
                  key={status}
                  label={status}
                  count={counts[status]}
                  pressed={filter === status}
                  onClick={() => setFilter(status)}
                />
              ))}
            </div>
            <SearchField
              label="Search claims by patient or claim ID"
              placeholder="Search patient or claim ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {session?.role === 'Biller' && (
            <p className="info-banner">
              <InfoIcon />
              You&rsquo;re signed in as a Biller. You can create and update claims; only admins can
              delete them.
            </p>
          )}

          <section className="panel panel--flush" aria-label="Claims list">
            <div className="table-scroll">
              <table className="table table--claims">
                <thead>
                  <tr>
                    <th scope="col">Claim</th>
                    <th scope="col">Patient</th>
                    <th scope="col">Payer</th>
                    <th scope="col">Service date</th>
                    <th scope="col">CPT · ICD</th>
                    <th scope="col" className="num">
                      Billed
                    </th>
                    <th scope="col" className="num">
                      Paid
                    </th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((c) => (
                    <tr key={c.id}>
                      <th scope="row">
                        <Link to={`/claims/${c.id}`} className="row-link">
                          {c.id}
                        </Link>
                      </th>
                      <td>{c.patient}</td>
                      <td>{c.payer}</td>
                      <td>{formatDate(c.serviceDate)}</td>
                      <td>
                        {c.cpt} · {c.icd}
                      </td>
                      <td className="num">{money.format(c.billed)}</td>
                      <td className="num">{c.paid === null ? '—' : money.format(c.paid)}</td>
                      <td>
                        <StatusBadge status={c.status} />
                        {c.denialReason && <span className="table__note">{c.denialReason}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visible.length === 0 && <p className="table__empty">No claims match your filters.</p>}
            <p className="table__footer" aria-live="polite">
              Showing {visible.length} of {data.length} claims
            </p>
          </section>
        </>
      )}
    </>
  )
}
