import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import { I18nProvider } from './i18n/I18nContext.jsx'
import { ReferenceDataProvider } from './api/ReferenceDataContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <ReferenceDataProvider>
          <App />
        </ReferenceDataProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
)
