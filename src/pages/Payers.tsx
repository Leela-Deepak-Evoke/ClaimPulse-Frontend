import { useQuery } from '@tanstack/react-query'
import { fetchPayers, type Payer } from '../api/payers.ts'
import { money, percentCompact } from '../app/format.ts'
import Loader from '../components/Loader.tsx'
import { PlusIcon, TrashIcon } from '../components/icons.tsx'
import { ButtonLink, IconButton, TextButton } from '../components/ui/index.ts'

function Stat({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className="payer-stat">
      <dt>{label}</dt>
      <dd className={alert ? 'payer-stat__alert' : undefined}>{value}</dd>
    </div>
  )
}

function PayerCard({ payer }: { payer: Payer }) {
  const denialRate = payer.claims > 0 ? payer.denied / payer.claims : 0
  return (
    <li className="payer-card">
      <div className="payer-card__head">
        <span className="payer-card__code" aria-hidden="true">
          {payer.code}
        </span>
        <div className="payer-card__title">
          <h2>{payer.name}</h2>
          <small>{payer.contact}</small>
        </div>
        <IconButton tone="danger" label={`Delete ${payer.name}`}>
          <TrashIcon />
        </IconButton>
      </div>

      <dl className="payer-card__stats">
        <Stat label="Claims" value={String(payer.claims)} />
        <Stat label="Denied" value={String(payer.denied)} alert={payer.denied > 0} />
        <Stat label="Billed" value={money.format(payer.billed)} />
        <Stat label="Collected" value={money.format(payer.collected)} />
      </dl>

      <div className="payer-card__rate">
        <span>Denial rate</span>
        <span>{percentCompact.format(denialRate)}</span>
      </div>
      <div
        className="progress progress--denied"
        role="progressbar"
        aria-label={`${payer.name} denial rate`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(denialRate * 100)}
      >
        <span style={{ width: `${denialRate * 100}%` }} />
      </div>
    </li>
  )
}

export default function Payers() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['payers'],
    queryFn: fetchPayers,
  })

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="title-with-badge">
            Payers <span className="badge">Admin only</span>
          </h1>
          <p className="page-head__sub">
            Insurance companies you send claims to, and how each one is paying.
          </p>
        </div>
        <ButtonLink to="/payers/new" icon={<PlusIcon />}>
          Add payer
        </ButtonLink>
      </header>

      {isPending && <Loader label="Loading payers…" />}
      {isError && (
        <p className="alert" role="alert">
          Could not load payers. <TextButton onClick={() => void refetch()}>Try again</TextButton>
        </p>
      )}
      {data && (
        <ul className="payer-grid" aria-label="Payers">
          {data.map((payer) => (
            <PayerCard key={payer.code} payer={payer} />
          ))}
        </ul>
      )}
    </>
  )
}
