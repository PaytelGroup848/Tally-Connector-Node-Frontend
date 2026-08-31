import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TallyProvider } from './context/TallyContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TallyProvider>
      <App />
    </TallyProvider>
  </StrictMode>,
)
