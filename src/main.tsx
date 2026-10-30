import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.layer.css'
import '@mantine/dates/styles.layer.css'
import App from './App.tsx'
import { queryClient } from './app/queryClient.ts'
import './index.css'
import './styles/ui.css'
import './styles/shell.css'
import './styles/claims.css'
import './styles/claim-details.css'
import './styles/claim-form.css'
import './styles/patients.css'
import './styles/payers.css'
import './styles/side-panel.css'
import './styles/access-denied.css'
import './styles/login-motion.css'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element #root not found')
}

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
