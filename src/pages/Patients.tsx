import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { fetchPatients, type Patient } from '../api/patients.ts'
import { formatDate } from '../app/format.ts'
import Loader from '../components/Loader.tsx'
import PatientEditPanel from '../components/PatientEditPanel.tsx'
import { PencilIcon, PlusIcon, TrashIcon } from '../components/icons.tsx'
import { ButtonLink, IconButton, SearchField, TextButton } from '../components/ui/index.ts'

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function matchesSearch(patient: Patient, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return (
    patient.name.toLowerCase().includes(needle) || patient.memberId.toLowerCase().includes(needle)
  )
}

export default function Patients() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
  })
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const editing = data?.find((p) => p.memberId === editingId)

  const visible = useMemo(
    () => (data ?? []).filter((patient) => matchesSearch(patient, search)),
    [data, search],
  )

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Patients</h1>
          <p className="page-head__sub">People whose visits are billed to insurance.</p>
        </div>
        <ButtonLink to="/patients/new" icon={<PlusIcon />}>
          Add patient
        </ButtonLink>
      </header>

      {isPending && <Loader label="Loading patients…" />}
      {isError && (
        <p className="alert" role="alert">
          Could not load patients. <TextButton onClick={() => void refetch()}>Try again</TextButton>
        </p>
      )}
      {data && (
        <>
          <div className="toolbar">
            <SearchField
              wide
              label="Search patients by name or member ID"
              placeholder="Search by name or member ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <section className="panel panel--flush" aria-label="Patients list">
            <div className="table-scroll">
              <table className="table table--patients">
                <thead>
                  <tr>
                    <th scope="col">Patient</th>
                    <th scope="col">Date of birth</th>
                    <th scope="col">Gender</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Member ID</th>
                    <th scope="col" className="num">
                      Claims
                    </th>
                    <th scope="col" className="num">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p) => (
                    <tr key={p.memberId}>
                      <th scope="row">
                        <span className="patient-cell">
                          <span className="patient-cell__avatar" aria-hidden="true">
                            {initials(p.name)}
                          </span>
                          {p.name}
                        </span>
                      </th>
                      <td>{formatDate(p.dateOfBirth)}</td>
                      <td>{p.gender}</td>
                      <td>{p.phone}</td>
                      <td className="strong">{p.memberId}</td>
                      <td className="num">{p.claims}</td>
                      <td className="num">
                        <span className="row-actions">
                          <IconButton
                            tone="edit"
                            label={`Edit ${p.name}`}
                            onClick={() => setEditingId(p.memberId)}
                          >
                            <PencilIcon />
                          </IconButton>
                          <IconButton tone="danger" label={`Delete ${p.name}`}>
                            <TrashIcon />
                          </IconButton>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visible.length === 0 && <p className="table__empty">No patients match your search.</p>}
            <p className="table__footer" aria-live="polite">
              Showing {visible.length} of {data.length} patients
            </p>
          </section>
        </>
      )}
      {editing && (
        <PatientEditPanel
          key={editing.memberId}
          patient={editing}
          onClose={() => setEditingId(null)}
        />
      )}
    </>
  )
}
