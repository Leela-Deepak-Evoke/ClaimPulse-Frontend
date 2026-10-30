import { MantineProvider } from '@mantine/core'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { mantineTheme } from '../../app/mantineTheme.ts'
import { RouterContext } from '../../app/router.ts'
import {
  Button,
  ButtonLink,
  Checkbox,
  DateField,
  FilterChip,
  IconButton,
  SearchField,
  SelectField,
  TextAreaField,
  TextButton,
  TextField,
} from './index.ts'

describe('Button', () => {
  it('defaults to a non-submitting primary button', () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('btn', 'btn--primary')
  })

  it('applies variant, size and full width', () => {
    render(
      <Button variant="danger" size="sm" fullWidth>
        Delete
      </Button>,
    )
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(
      'btn--danger',
      'btn--sm',
      'btn--block',
    )
  })

  it('is disabled and marked busy while loading', async () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Saving' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('ButtonLink', () => {
  it('navigates through the router and looks like a button', async () => {
    const navigate = vi.fn()
    render(
      <RouterContext.Provider value={{ path: '/', navigate }}>
        <ButtonLink to="/claims/new">New claim</ButtonLink>
      </RouterContext.Provider>,
    )
    const link = screen.getByRole('link', { name: 'New claim' })
    expect(link).toHaveClass('btn', 'btn--primary')
    expect(link).toHaveAttribute('href', '/claims/new')
    await userEvent.click(link)
    expect(navigate).toHaveBeenCalledWith('/claims/new')
  })
})

describe('IconButton and TextButton', () => {
  it('uses the label as the accessible name', () => {
    render(
      <IconButton label="Edit Ann" tone="edit">
        <svg />
      </IconButton>,
    )
    expect(screen.getByRole('button', { name: 'Edit Ann' })).toHaveClass('icon-btn--edit')
  })

  it('renders a text-styled button', async () => {
    const onClick = vi.fn()
    render(<TextButton onClick={onClick}>Try again</TextButton>)
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe('TextField', () => {
  it('connects the label, hint and input', () => {
    render(<TextField label="Name" hint="Use your legal name" />)
    const input = screen.getByLabelText('Name')
    expect(input).toHaveAccessibleDescription('Use your legal name')
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('shows the error instead of the hint and marks the input invalid', () => {
    render(<TextField label="Name" hint="Use your legal name" error="Enter the name." />)
    const input = screen.getByLabelText('Name')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Enter the name.')
    expect(screen.queryByText('Use your legal name')).not.toBeInTheDocument()
  })

  it('passes input props through and renders the end adornment', async () => {
    const onChange = vi.fn()
    render(
      <TextField
        label="Password"
        type="password"
        placeholder="Enter your password"
        onChange={onChange}
        labelAside={<a href="#forgot">Forgot password?</a>}
        endAdornment={<button type="button">Show</button>}
      />,
    )
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')
    await userEvent.type(input, 'ab')
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(screen.getByRole('link', { name: 'Forgot password?' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show' })).toBeInTheDocument()
  })

  it('gives each field its own id', () => {
    render(
      <>
        <TextField label="First" />
        <TextField label="Second" />
      </>,
    )
    expect(screen.getByLabelText('First').id).not.toBe(screen.getByLabelText('Second').id)
  })
})

describe('SelectField', () => {
  it('shows the placeholder and options and reports the choice', async () => {
    const onChange = vi.fn()
    render(
      <SelectField
        label="Gender"
        placeholder="Select a gender"
        options={['Male', { value: 'F', label: 'Female' }]}
        onChange={onChange}
      />,
    )
    const select = screen.getByLabelText('Gender')
    expect(screen.getByRole('option', { name: 'Select a gender' })).toHaveValue('')
    await userEvent.selectOptions(select, 'F')
    expect(onChange).toHaveBeenCalledOnce()
    expect(select).toHaveValue('F')
  })
})

describe('DateField', () => {
  function Harness({
    initial = '',
    onValue,
    error,
    maxDate,
  }: {
    initial?: string
    onValue?: (value: string) => void
    error?: string
    maxDate?: string
  }) {
    const [value, setValue] = useState(initial)
    return (
      <MantineProvider theme={mantineTheme}>
        <DateField
          label="Service date"
          value={value}
          error={error}
          {...(maxDate !== undefined && { maxDate })}
          onChange={(next) => {
            setValue(next)
            onValue?.(next)
          }}
        />
      </MantineProvider>
    )
  }

  it('shows the date in the app format', () => {
    render(<Harness initial="2026-08-06" />)
    expect(screen.getByLabelText('Service date')).toHaveValue('Aug 6, 2026')
  })

  it('accepts typed dates in several formats and reports YYYY-MM-DD', async () => {
    const onValue = vi.fn()
    render(<Harness onValue={onValue} />)
    const input = screen.getByLabelText('Service date')

    await userEvent.type(input, 'Sep 12, 2026')
    expect(onValue).toHaveBeenLastCalledWith('2026-09-12')

    await userEvent.clear(input)
    await userEvent.type(input, '2026-10-01')
    expect(onValue).toHaveBeenLastCalledWith('2026-10-01')

    await userEvent.clear(input)
    await userEvent.type(input, '3/4/2026')
    expect(onValue).toHaveBeenLastCalledWith('2026-03-04')
  })

  it('rejects text that is not a real date', async () => {
    const onValue = vi.fn()
    render(<Harness onValue={onValue} />)
    await userEvent.type(screen.getByLabelText('Service date'), 'Feb 30, 2026')
    expect(onValue).not.toHaveBeenCalledWith('2026-02-30')
  })

  it('marks the input invalid and describes the error', () => {
    render(<Harness error="Enter the service date." />)
    const input = screen.getByLabelText('Service date')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Enter the service date.')
  })

  it('opens a calendar and picks a day', async () => {
    const onValue = vi.fn()
    render(<Harness initial="2026-08-06" onValue={onValue} />)
    await userEvent.click(screen.getByLabelText('Service date'))
    await userEvent.click(await screen.findByRole('button', { name: /15 August 2026/ }))
    expect(onValue).toHaveBeenLastCalledWith('2026-08-15')
  })

  it('does not allow days after the maximum date', async () => {
    render(<Harness initial="2026-08-06" maxDate="2026-08-10" />)
    await userEvent.click(screen.getByLabelText('Service date'))
    expect(await screen.findByRole('button', { name: /11 August 2026/ })).toBeDisabled()
  })
})

describe('TextAreaField, Checkbox, SearchField and FilterChip', () => {
  it('marks optional text areas', () => {
    render(<TextAreaField label="Notes" optional />)
    expect(screen.getByLabelText('Notes (optional)')).toBeInTheDocument()
  })

  it('toggles a checkbox through its label', async () => {
    const onChange = vi.fn()
    render(<Checkbox label="Keep me signed in" onChange={onChange} />)
    await userEvent.click(screen.getByLabelText('Keep me signed in'))
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('labels the search box without showing the label', () => {
    render(<SearchField label="Search claims" placeholder="Search" />)
    const box = screen.getByRole('searchbox', { name: 'Search claims' })
    expect(box).toHaveAttribute('placeholder', 'Search')
  })

  it('exposes the chip state and count', async () => {
    const onClick = vi.fn()
    render(<FilterChip label="Denied" count={5} pressed onClick={onClick} />)
    const chip = screen.getByRole('button', { name: 'Denied 5' })
    expect(chip).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(chip)
    expect(onClick).toHaveBeenCalledOnce()
  })
})
