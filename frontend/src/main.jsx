import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios'
import './index.css'
import App from './App.jsx'

axios.defaults.withCredentials = true // to use JWT token cookie

// Read the CSRF cookie and attach it as a header on every request
axios.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf-token='))
    ?.split('=')[1]
  if (csrfToken) {
    // assign CSRF token from cookie to header
    config.headers['x-csrf-token'] = decodeURIComponent(csrfToken)
  }
  return config
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
