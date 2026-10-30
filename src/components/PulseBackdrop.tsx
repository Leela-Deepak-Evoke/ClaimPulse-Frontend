import type { CSSProperties } from 'react'

const CROSSES = [
  { left: '6%', size: 14, delay: '0s', duration: '15s' },
  { left: '22%', size: 9, delay: '4s', duration: '12s' },
  { left: '38%', size: 18, delay: '8s', duration: '17s' },
  { left: '55%', size: 10, delay: '2s', duration: '13s' },
  { left: '72%', size: 16, delay: '6s', duration: '16s' },
  { left: '88%', size: 11, delay: '10s', duration: '14s' },
]

const ECG_PATH =
  'M0 60 H120 L140 60 L155 18 L178 104 L198 40 L214 60 H330 L346 60 L362 24 L384 98 L402 46 L418 60 H600'

export default function PulseBackdrop() {
  return (
    <div className="pulse-bg" aria-hidden="true">
      {CROSSES.map((cross) => (
        <span
          key={cross.left}
          className="pulse-bg__cross"
          style={
            {
              left: cross.left,
              '--size': `${cross.size}px`,
              '--delay': cross.delay,
              '--duration': cross.duration,
            } as CSSProperties
          }
        />
      ))}
      <svg
        className="pulse-bg__ecg"
        viewBox="0 0 600 120"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path className="pulse-bg__track" d={ECG_PATH} pathLength={1} />
        <path className="pulse-bg__beat" d={ECG_PATH} pathLength={1} />
      </svg>
    </div>
  )
}
