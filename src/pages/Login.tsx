import { useState, type FormEvent } from 'react'
import { AuthError, DEMO_PASSWORD } from '../api/auth.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from '../components/icons.tsx'
import PulseBackdrop from '../components/PulseBackdrop.tsx'
import { Button, Checkbox, IconButton, TextField } from '../components/ui/index.ts'

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
        <PulseBackdrop />
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

            <TextField
              label="Work email"
              type="email"
              autoComplete="username"
              placeholder="you@company.com"
              icon={<MailIcon />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <TextField
              label="Password"
              labelAside={
                <a href="#forgot" className="link" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              }
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              icon={<LockIcon size={16} />}
              endAdornment={
                <IconButton
                  tone="muted"
                  label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </IconButton>
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <Checkbox
              label="Keep me signed in on this device"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />

            <Button type="submit" fullWidth loading={submitting}>
              {submitting ? 'Signing in…' : 'Sign in →'}
            </Button>
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
