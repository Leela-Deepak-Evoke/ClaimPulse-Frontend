import { useAuth } from '../auth/AuthContext.tsx'
import { LockIcon } from '../components/icons.tsx'
import { ButtonLink } from '../components/ui/index.ts'

// Sample contacts until the backend exposes who the admins are.
const ADMIN_CONTACTS = ['Ananya Reddy', 'Rohit Sharma']

const listFormat = new Intl.ListFormat('en', { type: 'disjunction' })

export default function AccessDenied({ action }: { action: string }) {
  const { session } = useAuth()

  return (
    <section className="denied" aria-labelledby="denied-title">
      <div className="denied__card">
        <span className="denied__icon" aria-hidden="true">
          <LockIcon />
        </span>
        <p className="denied__code">Error 403</p>
        <h1 id="denied-title">Access denied</h1>
        <p className="denied__text">
          {action} is limited to admins.
          {session && (
            <>
              {' '}
              You&rsquo;re signed in as{' '}
              <strong>
                {session.name} ({session.role})
              </strong>
              .
            </>
          )}{' '}
          Ask {listFormat.format(ADMIN_CONTACTS)} if a payer needs to be added or changed.
        </p>
        <ButtonLink to="/">Back to dashboard</ButtonLink>
      </div>
    </section>
  )
}
