import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.tsx'

const ADMIN = 'ananya.reddy@claimpulse.example.com'

describe('App routing and login', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.history.replaceState(null, '', '/')
  })

  it('sends an unauthenticated visitor to the login screen', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/login')
  })

  it('shows validation errors for empty fields', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /sign in →/i }))
    expect(screen.getByText('Enter your work email.')).toBeInTheDocument()
    expect(screen.getByText('Enter your password.')).toBeInTheDocument()
  })

  it('rejects wrong credentials', async () => {
    render(<App />)
    await userEvent.type(screen.getByLabelText('Work email'), ADMIN)
    await userEvent.type(screen.getByLabelText('Password'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /sign in →/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect email or password.')
  })

  it('blocks inactive accounts', async () => {
    render(<App />)
    await userEvent.type(screen.getByLabelText('Work email'), 'saiteja.goud@claimpulse.example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'Demo@123')
    await userEvent.click(screen.getByRole('button', { name: /sign in →/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('inactive')
  })

  it('signs in, lands on the home page, and signs out back to login', async () => {
    render(<App />)
    await userEvent.type(screen.getByLabelText('Work email'), ADMIN)
    await userEvent.type(screen.getByLabelText('Password'), 'Demo@123')
    await userEvent.click(screen.getByRole('button', { name: /sign in →/i }))
    expect(await screen.findByText(/Signed in as Ananya Reddy/)).toBeInTheDocument()
    expect(window.location.pathname).toBe('/')

    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/login')
  })

  it('toggles password visibility', async () => {
    render(<App />)
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(input).toHaveAttribute('type', 'text')
  })
})
