import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { forLintError } from './forLintError.ts'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
