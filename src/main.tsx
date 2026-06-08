import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/bebas-neue';
import './index.css';
import App from './App';
import { ContentProvider } from './context/ContentContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContentProvider>
      <App />
    </ContentProvider>
  </StrictMode>
);
