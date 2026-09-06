import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./i18n";
import App from './App'
import { HelmetProvider } from 'react-helmet-async'

import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)