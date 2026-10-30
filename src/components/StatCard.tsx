import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  detail: ReactNode
  tone?: 'paid' | 'denied' | 'pending'
}

export default function StatCard({ label, value, detail, tone }: StatCardProps) {
  return (
    <div className="panel stat">
      <p className="stat__label">
        {tone && <span className={`dot dot--${tone}`} aria-hidden="true" />}
        {label}
      </p>
      <p className="stat__value">{value}</p>
      <p className="stat__detail">{detail}</p>
    </div>
  )
}
