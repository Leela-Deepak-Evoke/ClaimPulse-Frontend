import { createTheme } from '@mantine/core'

// Colours, surfaces and text come from the project tokens (see the Mantine variable mapping in
// src/styles/ui.css); this theme only sets what Mantine needs in JavaScript.
export const mantineTheme = createTheme({
  primaryColor: 'teal',
  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  defaultRadius: 'sm',
  radius: { sm: '0.5rem', md: '0.75rem' },
})
