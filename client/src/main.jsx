import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ReactLenis, useLenis } from 'lenis/react'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <SidebarProvider> */}
    <ReactLenis root />
      <App />
    {/* </SidebarProvider> */}
  </StrictMode>,
)
