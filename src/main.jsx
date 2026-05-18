import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Arrays from './pages/Arrays.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Arrays/>
  </StrictMode>,
)
