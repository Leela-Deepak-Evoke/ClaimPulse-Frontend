interface FilterChipProps {
  label: string
  count?: number
  pressed: boolean
  onClick: () => void
}

export default function FilterChip({ label, count, pressed, onClick }: FilterChipProps) {
  return (
    <button type="button" className="chip" aria-pressed={pressed} onClick={onClick}>
      {label}
      {count !== undefined && (
        <>
          {' '}
          <span className="chip__count">{count}</span>
        </>
      )}
    </button>
  )
}
