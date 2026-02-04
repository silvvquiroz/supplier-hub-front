import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './shared/styles/global.css'
import './shared/components/Button/Button.css'
import './shared/components/Input/Input.css'
import './shared/components/Form/Form.css'
import './shared/components/UserButton/UserButton.css'
import App from './App'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
