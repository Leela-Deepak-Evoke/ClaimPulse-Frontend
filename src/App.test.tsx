import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.tsx'

const ADMIN = 'ananya.reddy@claimpulse.example.com'

function renderApp() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>,
  )
}

const BILLER = 'priya.nair@claimpulse.example.com'

async function signIn(email = ADMIN) {
  await userEvent.type(screen.getByLabelText('Work email'), email)
  await userEvent.type(screen.getByLabelText('Password'), 'Demo@123')
  await userEvent.click(screen.getByRole('button', { name: /sign in →/i }))
}

describe('App routing and login', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.history.replaceState(null, '', '/')
  })

  it('sends an unauthenticated visitor to the login screen', () => {
    renderApp()
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/login')
  })

  it('shows validation errors for empty fields', async () => {
    renderApp()
    await userEvent.click(screen.getByRole('button', { name: /sign in →/i }))
    expect(screen.getByText('Enter your work email.')).toBeInTheDocument()
    expect(screen.getByText('Enter your password.')).toBeInTheDocument()
  })

  it('rejects wrong credentials', async () => {
    renderApp()
    await userEvent.type(screen.getByLabelText('Work email'), ADMIN)
    await userEvent.type(screen.getByLabelText('Password'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /sign in →/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect email or password.')
  })

  it('blocks inactive accounts', async () => {
    renderApp()
    await userEvent.type(screen.getByLabelText('Work email'), 'saiteja.goud@claimpulse.example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'Demo@123')
    await userEvent.click(screen.getByRole('button', { name: /sign in →/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('inactive')
  })

  it('toggles password visibility', async () => {
    renderApp()
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(input).toHaveAttribute('type', 'text')
  })
})

describe('Dashboard', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.history.replaceState(null, '', '/')
  })

  it('signs in and shows the dashboard figures', async () => {
    renderApp()
    await signIn()

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/')
    expect(await screen.findByText(/Welcome back, Ananya\./)).toBeInTheDocument()
    expect(await screen.findByText('$7,110.00 billed')).toBeInTheDocument()
    expect(screen.getByText('$4,267.40 collected')).toBeInTheDocument()
    expect(screen.getByText('33.3% denial rate')).toBeInTheDocument()
    expect(screen.getByText('60.0%')).toBeInTheDocument()

    const recent = screen.getByRole('region', { name: 'Recent claims' })
    expect(within(recent).getByText('CLM-0015')).toBeInTheDocument()
    expect(within(recent).getAllByRole('row')).toHaveLength(6)
  })

  it('navigates from the sidebar and marks the current page', async () => {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })

    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page',
    )

    await userEvent.click(within(nav).getByRole('link', { name: 'Patients' }))
    expect(await screen.findByRole('heading', { name: 'Patients' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/patients')
  })

  it('follows the View all claims link', async () => {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })

    await userEvent.click(await screen.findByRole('link', { name: 'View all claims' }))
    expect(window.location.pathname).toBe('/claims')
  })

  it('lists claims and filters by status and search', async () => {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })
    await userEvent.click(
      within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', {
        name: 'Claims',
      }),
    )

    expect(await screen.findByText('Showing 15 of 15 claims')).toBeInTheDocument()
    const filters = screen.getByRole('group', { name: 'Filter by status' })
    expect(within(filters).getByRole('button', { name: 'All 15' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await userEvent.click(within(filters).getByRole('button', { name: 'Denied 5' }))
    expect(screen.getByText('Showing 5 of 15 claims')).toBeInTheDocument()
    expect(screen.getByText('Coding error')).toBeInTheDocument()

    await userEvent.type(screen.getByRole('searchbox'), 'wilson')
    expect(screen.getByText('Showing 2 of 15 claims')).toBeInTheDocument()

    await userEvent.clear(screen.getByRole('searchbox'))
    await userEvent.type(screen.getByRole('searchbox'), 'zzz')
    expect(screen.getByText('No claims match your filters.')).toBeInTheDocument()
  })

  it('opens a claim from the list and goes back', async () => {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })
    const nav = screen.getByRole('navigation', { name: 'Main' })
    await userEvent.click(within(nav).getByRole('link', { name: 'Claims' }))

    await userEvent.click(await screen.findByRole('link', { name: 'CLM-0002' }))
    expect(await screen.findByRole('heading', { name: /CLM-0002/ })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/claims/CLM-0002')
    expect(screen.getByText('AET553201')).toBeInTheDocument()
    expect(screen.getByText('Claim submitted to Aetna')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mark paid' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Deny' })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: 'Claims' })).toHaveAttribute(
      'aria-current',
      'page',
    )

    await userEvent.click(screen.getByRole('link', { name: 'Back to claims' }))
    expect(await screen.findByText('Showing 15 of 15 claims')).toBeInTheDocument()
  })

  it('shows a not-found message for an unknown claim', async () => {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })
    window.history.pushState(null, '', '/claims/CLM-9999')
    window.dispatchEvent(new PopStateEvent('popstate'))

    expect(await screen.findByText('Claim CLM-9999 was not found.')).toBeInTheDocument()
  })

  it('hides status actions for a paid claim', async () => {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })
    window.history.pushState(null, '', '/claims/CLM-0001')
    window.dispatchEvent(new PopStateEvent('popstate'))

    const card = await screen.findByRole('region', { name: 'Update status' })
    expect(card).toHaveTextContent('This claim is Paid.')
    expect(card.querySelector('.pill--paid')).toHaveTextContent('Paid')
    expect(screen.queryByRole('button', { name: 'Mark paid' })).not.toBeInTheDocument()
  })

  it('highlights the denied status in the Update status card', async () => {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })
    window.history.pushState(null, '', '/claims/CLM-0003')
    window.dispatchEvent(new PopStateEvent('popstate'))

    const card = await screen.findByRole('region', { name: 'Update status' })
    expect(card).toHaveTextContent('This claim is Denied.')
    expect(card.querySelector('.pill--denied')).toHaveTextContent('Denied')
  })

  it('lists patients with claim counts and searches by name or member ID', async () => {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })
    await userEvent.click(
      within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', {
        name: 'Patients',
      }),
    )

    expect(await screen.findByText('Showing 10 of 10 patients')).toBeInTheDocument()
    const emily = screen.getByRole('row', { name: /Emily Johnson/ })
    expect(within(emily).getByText('AET553201')).toBeInTheDocument()
    expect(within(emily).getByText('Jul 22, 1986')).toBeInTheDocument()
    expect(within(emily).getByRole('cell', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit John Carter' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete John Carter' })).toBeInTheDocument()

    await userEvent.type(screen.getByRole('searchbox'), 'aet')
    expect(screen.getByText('Showing 2 of 10 patients')).toBeInTheDocument()

    await userEvent.clear(screen.getByRole('searchbox'))
    await userEvent.type(screen.getByRole('searchbox'), 'carter')
    expect(screen.getByText('Showing 1 of 10 patients')).toBeInTheDocument()

    await userEvent.clear(screen.getByRole('searchbox'))
    await userEvent.type(screen.getByRole('searchbox'), 'zzz')
    expect(screen.getByText('No patients match your search.')).toBeInTheDocument()
  })

  async function openPatients() {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })
    await userEvent.click(
      within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', {
        name: 'Patients',
      }),
    )
  }

  it('edits a patient in a side panel', async () => {
    await openPatients()
    await userEvent.click(await screen.findByRole('button', { name: 'Edit Mia Robinson' }))

    const dialog = screen.getByRole('dialog', { name: 'Edit patient' })
    const panel = within(dialog)
    expect(panel.getByLabelText('Full name')).toHaveValue('Mia Robinson')
    expect(panel.getByLabelText('Full name')).toHaveFocus()
    expect(panel.getByLabelText('Date of birth')).toHaveValue('Oct 11, 1983')
    expect(panel.getByLabelText('Gender')).toHaveValue('Other')
    expect(panel.getByLabelText('Member ID')).toHaveValue('MCD440766')

    await userEvent.clear(panel.getByLabelText('Full name'))
    await userEvent.clear(panel.getByLabelText('Phone'))
    await userEvent.click(panel.getByRole('button', { name: 'Save changes' }))
    expect(panel.getByText('Enter the patient name.')).toBeInTheDocument()
    expect(panel.getByText('Enter a phone number.')).toBeInTheDocument()

    await userEvent.type(panel.getByLabelText('Full name'), 'Mia Robinson-Lee')
    await userEvent.type(panel.getByLabelText('Phone'), '+1-555-0299')
    await userEvent.click(panel.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    const row = screen.getByRole('row', { name: /Mia Robinson-Lee/ })
    expect(within(row).getByText('+1-555-0299')).toBeInTheDocument()
    expect(within(row).getByRole('cell', { name: '1' })).toBeInTheDocument()
  })

  it('closes the patient panel with Escape and Cancel', async () => {
    await openPatients()
    const editButton = await screen.findByRole('button', { name: 'Edit John Carter' })

    await userEvent.click(editButton)
    expect(screen.getByRole('dialog', { name: 'Edit patient' })).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(editButton).toHaveFocus()

    await userEvent.click(editButton)
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('rejects a member ID that belongs to another patient', async () => {
    await openPatients()
    await userEvent.click(await screen.findByRole('button', { name: 'Edit John Carter' }))
    const panel = within(screen.getByRole('dialog', { name: 'Edit patient' }))

    await userEvent.clear(panel.getByLabelText('Member ID'))
    await userEvent.type(panel.getByLabelText('Member ID'), 'aet553201')
    await userEvent.click(panel.getByRole('button', { name: 'Save changes' }))
    expect(
      await panel.findByText('A patient with this member ID already exists.'),
    ).toBeInTheDocument()
  })

  it('shows payer cards with figures calculated from the claims', async () => {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })
    await userEvent.click(
      within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', {
        name: 'Payers',
      }),
    )

    expect(await screen.findByRole('heading', { name: /Payers/ })).toBeInTheDocument()
    expect(screen.getByText('Admin only')).toBeInTheDocument()
    const list = await screen.findByRole('list', { name: 'Payers' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(5)
    const medicare = within(list).getByRole('heading', { name: 'Medicare' }).closest('li')
    expect(medicare).not.toBeNull()
    const card = within(medicare as HTMLElement)
    expect(card.getByText('$595.00')).toBeInTheDocument()
    expect(card.getByText('$152.40')).toBeInTheDocument()
    expect(card.getByText('75%')).toBeInTheDocument()

    const blueCross = screen.getByRole('heading', { name: 'Blue Cross' }).closest('li')
    expect(within(blueCross as HTMLElement).getByText('66.7%')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete Aetna' })).toBeInTheDocument()
  })

  it('hides Payers from billers and shows access denied', async () => {
    renderApp()
    await userEvent.type(screen.getByLabelText('Work email'), 'priya.nair@claimpulse.example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'Demo@123')
    await userEvent.click(screen.getByRole('button', { name: /sign in →/i }))
    await screen.findByRole('heading', { name: 'Dashboard' })

    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(within(nav).queryByRole('link', { name: 'Payers' })).not.toBeInTheDocument()

    window.history.pushState(null, '', '/payers')
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(await screen.findByRole('heading', { name: 'Access denied' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/payers')
    expect(screen.getByText('Error 403')).toBeInTheDocument()
    expect(screen.getByText('Priya Nair (Biller)')).toBeInTheDocument()
    expect(screen.getByText(/Ask Ananya Reddy or Rohit Sharma/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Add payer' })).not.toBeInTheDocument()

    window.history.pushState(null, '', '/payers/new')
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(await screen.findByRole('heading', { name: 'Access denied' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: 'Back to dashboard' }))
    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/')
  })

  it('shows billers a notice on Claims and no Delete claim button', async () => {
    renderApp()
    await signIn(BILLER)
    await screen.findByRole('heading', { name: 'Dashboard' })
    await userEvent.click(
      within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', {
        name: 'Claims',
      }),
    )
    expect(
      await screen.findByText(/You.re signed in as a Biller\. You can create and update claims/),
    ).toBeInTheDocument()

    await userEvent.click(await screen.findByRole('link', { name: 'CLM-0002' }))
    expect(await screen.findByRole('heading', { name: /CLM-0002/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mark paid' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete claim' })).not.toBeInTheDocument()
  })

  it('shows admins no notice on Claims and a Delete claim button', async () => {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })
    await userEvent.click(
      within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', {
        name: 'Claims',
      }),
    )
    await screen.findByText('Showing 15 of 15 claims')
    expect(screen.queryByText(/signed in as a Biller/)).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: 'CLM-0002' }))
    expect(await screen.findByRole('button', { name: 'Delete claim' })).toBeInTheDocument()
  })

  it('signs out back to the login screen', async () => {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })

    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/login')
  })

  it('toggles the mobile menu', async () => {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })

    const toggle = screen.getByRole('button', { name: 'Open menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(toggle)
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })
})

describe('New claim', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.history.replaceState(null, '', '/')
  })

  async function openNewClaim() {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })
    const nav = screen.getByRole('navigation', { name: 'Main' })
    await userEvent.click(within(nav).getByRole('link', { name: 'New claim' }))
    return screen.findByRole('button', { name: 'Create claim' })
  }

  it('validates required fields and a positive billed amount', async () => {
    await userEvent.click(await openNewClaim())
    expect(screen.getByText('Select a patient.')).toBeInTheDocument()
    expect(screen.getByText('Select a payer.')).toBeInTheDocument()
    expect(screen.getByText('Enter the service date.')).toBeInTheDocument()
    expect(screen.getByText('Enter the billed amount.')).toBeInTheDocument()
    expect(screen.getByText('Enter the CPT code.')).toBeInTheDocument()
    expect(screen.getByText('Enter the ICD code.')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Billed amount (USD)'), '0')
    await userEvent.click(screen.getByRole('button', { name: 'Create claim' }))
    expect(screen.getByText('Billed amount must be greater than zero.')).toBeInTheDocument()
  })

  it('cancels back to the claims list', async () => {
    await openNewClaim()
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(window.location.pathname).toBe('/claims')
  })

  it('creates a claim and opens its details', async () => {
    await openNewClaim()
    await userEvent.selectOptions(screen.getByLabelText('Patient'), 'Olivia Davis')
    await userEvent.selectOptions(screen.getByLabelText('Payer (insurance)'), 'Aetna')
    await userEvent.type(screen.getByLabelText('Service date'), '2026-10-01')
    await userEvent.type(screen.getByLabelText('Billed amount (USD)'), '180.00')
    await userEvent.type(screen.getByLabelText('CPT code (procedure)'), '99213')
    await userEvent.type(screen.getByLabelText('ICD code (diagnosis)'), 'E11.9')
    await userEvent.type(screen.getByLabelText(/Notes/), 'Follow-up visit')
    await userEvent.click(screen.getByRole('button', { name: 'Create claim' }))

    expect(await screen.findByRole('heading', { name: /CLM-0016/ })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/claims/CLM-0016')
    expect(screen.getByText('Follow-up visit')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mark paid' })).toBeInTheDocument()
  })
})

describe('Add payer', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.history.replaceState(null, '', '/')
  })

  async function openAddPayer() {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })
    const nav = screen.getByRole('navigation', { name: 'Main' })
    await userEvent.click(within(nav).getByRole('link', { name: 'Payers' }))
    await userEvent.click(await screen.findByRole('link', { name: 'Add payer' }))
    return screen.findByRole('button', { name: 'Add payer' })
  }

  it('validates the fields and rejects duplicates', async () => {
    await userEvent.click(await openAddPayer())
    expect(screen.getByText('Enter the payer name.')).toBeInTheDocument()
    expect(screen.getByText('Enter the payer code.')).toBeInTheDocument()
    expect(screen.getByText('Enter a contact phone number.')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Payer name'), 'aetna')
    await userEvent.type(screen.getByLabelText('Payer code'), 'A!')
    await userEvent.type(screen.getByLabelText('Contact phone'), 'abc')
    await userEvent.click(screen.getByRole('button', { name: 'Add payer' }))
    expect(screen.getByText('Use 2 to 6 letters or numbers.')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid phone number.')).toBeInTheDocument()

    await userEvent.clear(screen.getByLabelText('Payer code'))
    await userEvent.type(screen.getByLabelText('Payer code'), 'AE')
    await userEvent.clear(screen.getByLabelText('Contact phone'))
    await userEvent.type(screen.getByLabelText('Contact phone'), '+1-555-0199')
    await userEvent.click(screen.getByRole('button', { name: 'Add payer' }))
    expect(await screen.findByText('A payer with this name already exists.')).toBeInTheDocument()
  })

  it('adds a payer and shows it on the Payers page', async () => {
    await openAddPayer()
    await userEvent.type(screen.getByLabelText('Payer name'), 'Cigna')
    await userEvent.type(screen.getByLabelText('Payer code'), 'cig')
    await userEvent.type(screen.getByLabelText('Contact phone'), '+1-555-0106')
    await userEvent.click(screen.getByRole('button', { name: 'Add payer' }))

    const list = await screen.findByRole('list', { name: 'Payers' })
    expect(window.location.pathname).toBe('/payers')
    expect(within(list).getAllByRole('listitem')).toHaveLength(6)
    const cigna = within(list).getByRole('heading', { name: 'Cigna' }).closest('li')
    expect(within(cigna as HTMLElement).getByText('CIG')).toBeInTheDocument()
  })

  it('cancels back to the Payers page', async () => {
    await openAddPayer()
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(window.location.pathname).toBe('/payers')
  })
})

describe('Add patient', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.history.replaceState(null, '', '/')
  })

  async function openAddPatient() {
    renderApp()
    await signIn()
    await screen.findByRole('heading', { name: 'Dashboard' })
    const nav = screen.getByRole('navigation', { name: 'Main' })
    await userEvent.click(within(nav).getByRole('link', { name: 'Patients' }))
    await userEvent.click(await screen.findByRole('link', { name: 'Add patient' }))
    return screen.findByRole('button', { name: 'Add patient' })
  }

  async function fillForm(name: string, memberId: string) {
    await userEvent.type(screen.getByLabelText('Full name'), name)
    await userEvent.type(screen.getByLabelText('Date of birth'), '1992-02-14')
    await userEvent.selectOptions(screen.getByLabelText('Gender'), 'Female')
    await userEvent.type(screen.getByLabelText('Phone'), '+1-555-0211')
    await userEvent.type(screen.getByLabelText('Member ID'), memberId)
  }

  it('validates the fields', async () => {
    await userEvent.click(await openAddPatient())
    expect(screen.getByText('Enter the patient name.')).toBeInTheDocument()
    expect(screen.getByText('Enter the date of birth.')).toBeInTheDocument()
    expect(screen.getByText('Select a gender.')).toBeInTheDocument()
    expect(screen.getByText('Enter a phone number.')).toBeInTheDocument()
    expect(screen.getByText('Enter the member ID.')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Member ID'), 'ab!')
    await userEvent.click(screen.getByRole('button', { name: 'Add patient' }))
    expect(screen.getByText('Use 5 to 12 letters or numbers.')).toBeInTheDocument()
  })

  it('rejects a duplicate name or member ID', async () => {
    await openAddPatient()
    await fillForm('emily johnson', 'NEW100001')
    await userEvent.click(screen.getByRole('button', { name: 'Add patient' }))
    expect(await screen.findByText('A patient with this name already exists.')).toBeInTheDocument()

    await userEvent.clear(screen.getByLabelText('Full name'))
    await userEvent.type(screen.getByLabelText('Full name'), 'Grace Lee')
    await userEvent.clear(screen.getByLabelText('Member ID'))
    await userEvent.type(screen.getByLabelText('Member ID'), 'aet553201')
    await userEvent.click(screen.getByRole('button', { name: 'Add patient' }))
    expect(
      await screen.findByText('A patient with this member ID already exists.'),
    ).toBeInTheDocument()
  })

  it('adds a patient and shows them on the Patients page', async () => {
    await openAddPatient()
    await fillForm('Grace Lee', 'gl100200')
    await userEvent.click(screen.getByRole('button', { name: 'Add patient' }))

    expect(await screen.findByText('Showing 11 of 11 patients')).toBeInTheDocument()
    expect(window.location.pathname).toBe('/patients')
    const row = screen.getByRole('row', { name: /Grace Lee/ })
    expect(within(row).getByText('GL100200')).toBeInTheDocument()
    expect(within(row).getByRole('cell', { name: '0' })).toBeInTheDocument()
  })

  it('cancels back to the Patients page', async () => {
    await openAddPatient()
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(window.location.pathname).toBe('/patients')
  })
})
