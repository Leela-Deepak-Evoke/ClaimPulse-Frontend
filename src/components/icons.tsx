import type { ReactNode } from 'react'

function SvgIcon({ children, size = 18 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
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

export const DashboardIcon = () => (
  <SvgIcon>
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </SvgIcon>
)

export const ClaimsIcon = () => (
  <SvgIcon>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" />
  </SvgIcon>
)

export const NewClaimIcon = () => (
  <SvgIcon>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8M12 8v8" />
  </SvgIcon>
)

export const PatientsIcon = () => (
  <SvgIcon>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </SvgIcon>
)

export const PayersIcon = () => (
  <SvgIcon>
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
  </SvgIcon>
)

export const SignOutIcon = () => (
  <SvgIcon>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </SvgIcon>
)

export const PlusIcon = () => (
  <SvgIcon size={16}>
    <path d="M5 12h14M12 5v14" />
  </SvgIcon>
)

export const SearchIcon = () => (
  <SvgIcon size={16}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </SvgIcon>
)

export const ArrowLeftIcon = () => (
  <SvgIcon size={14}>
    <path d="m12 19-7-7 7-7M19 12H5" />
  </SvgIcon>
)

export const TrashIcon = () => (
  <SvgIcon size={14}>
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
  </SvgIcon>
)

export const PencilIcon = () => (
  <SvgIcon size={14}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5ZM15 5l4 4" />
  </SvgIcon>
)

export const XIcon = () => (
  <SvgIcon>
    <path d="M18 6 6 18M6 6l12 12" />
  </SvgIcon>
)

export const CalendarIcon = () => (
  <SvgIcon size={16}>
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </SvgIcon>
)

export const MailIcon = () => (
  <SvgIcon size={16}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </SvgIcon>
)

export const EyeIcon = () => (
  <SvgIcon>
    <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
    <circle cx="12" cy="12" r="3" />
  </SvgIcon>
)

export const EyeOffIcon = () => (
  <SvgIcon>
    <path d="M9.9 4.2A10 10 0 0 1 12 4c7 0 10 8 10 8a17 17 0 0 1-2.2 3.2M6.6 6.6A17 17 0 0 0 2 12s3 8 10 8a10 10 0 0 0 5.4-1.6" />
    <path d="m2 2 20 20" />
  </SvgIcon>
)

export const LockIcon = ({ size = 20 }: { size?: number }) => (
  <SvgIcon size={size}>
    <rect width="18" height="11" x="3" y="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </SvgIcon>
)

export const InfoIcon = () => (
  <SvgIcon size={14}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </SvgIcon>
)

export const MenuIcon = () => (
  <SvgIcon size={22}>
    <path d="M4 12h16M4 6h16M4 18h16" />
  </SvgIcon>
)
