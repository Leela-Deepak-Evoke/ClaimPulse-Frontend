import { useState, type FormEvent, type ReactNode } from 'react'
import { AuthError, DEMO_PASSWORD } from '../api/auth.ts'
import { useAuth } from '../auth/AuthContext.tsx'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const DEMO_ACCOUNTS = [
  { email: 'ananya.reddy@claimpulse.example.com', label: 'Admin' },
  { email: 'priya.nair@claimpulse.example.com', label: 'Biller' },
  { email: 'saiteja.goud@claimpulse.example.com', label: 'Inactive' },
]

const STATUS_FLOW = [
  { label: 'Submitted', tone: 'submitted' },
  { label: 'Paid', tone: 'paid' },
  { label: 'Denied', tone: 'denied' },
  { label: 'Resubmitted', tone: 'resubmitted' },
]

const FEATURES = [
  'Track claims by patient, payer and status',
  'Record denial reasons and resubmit faster',
  'See billed vs collected and denial rate at a glance',
]

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="field__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: typeof errors = {}
    if (!email.trim()) next.email = 'Enter your work email.'
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Enter your password.'
    setErrors(next)
    setFormError(null)
    if (next.email || next.password) return

    setSubmitting(true)
    try {
      await signIn(email, password, remember)
    } catch (err) {
      setFormError(err instanceof AuthError ? err.message : 'Something went wrong. Try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="login">
      <aside className="login__brand">
        <div className="logo">
          <span className="logo__mark" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </span>
          ClaimPulse
        </div>

        <div className="login__hero">
          <h1>Every claim, from submission to payment.</h1>
          <p>
            A simple workspace for billing teams to track insurance claims, capture denial reasons
            and keep revenue moving.
          </p>

          <div className="lifecycle">
            <span className="lifecycle__title">Claim lifecycle</span>
            <ol className="lifecycle__flow">
              {STATUS_FLOW.map((s, i) => (
                <li key={s.label}>
                  <span className={`pill pill--${s.tone}`}>{s.label}</span>
                  {i === 1 && <span className="lifecycle__or">or</span>}
                  {i !== 1 && i < STATUS_FLOW.length - 1 && <span aria-hidden="true">→</span>}
                </li>
              ))}
            </ol>
          </div>

          <ul className="features">
            {FEATURES.map((f) => (
              <li key={f}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="login__footnote">Demo project · React · FastAPI · PostgreSQL</p>
      </aside>

      <main className="login__panel">
        <div className="card">
          <h2>Sign in</h2>
          <p className="card__lead">
            Welcome back. Enter your details to open your claims workspace.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {formError && (
              <p className="alert" role="alert">
                {formError}
              </p>
            )}

            <div className="field">
              <label htmlFor="email">Work email</label>
              <div className="field__control">
                <Icon>
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-10 6L2 7" />
                </Icon>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p className="field__error" id="email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="field">
              <div className="field__row">
                <label htmlFor="password">Password</label>
                <a href="#forgot" className="link" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>
              <div className="field__control">
                <Icon>
                  <rect width="18" height="11" x="3" y="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </Icon>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {showPassword ? (
                      <>
                        <path d="M9.9 4.2A10 10 0 0 1 12 4c7 0 10 8 10 8a17 17 0 0 1-2.2 3.2M6.6 6.6A17 17 0 0 0 2 12s3 8 10 8a10 10 0 0 0 5.4-1.6" />
                        <path d="m2 2 20 20" />
                      </>
                    ) : (
                      <>
                        <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p className="field__error" id="password-error">
                  {errors.password}
                </p>
              )}
            </div>

            <label className="check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Keep me signed in on this device
            </label>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <p className="notice">
            Authorized billing staff only. Access is role-based and all activity is logged. Use
            sample data only in this demo.
          </p>

          <div className="demo">
            <strong>Demo accounts</strong> (password {DEMO_PASSWORD}):
            <ul>
              {DEMO_ACCOUNTS.map((a) => (
                <li key={a.email}>
                  {a.email} ({a.label})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
