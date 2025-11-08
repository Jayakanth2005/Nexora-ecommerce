import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppEnhanced from './AppEnhanced.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppEnhanced />
  </StrictMode>,
)
