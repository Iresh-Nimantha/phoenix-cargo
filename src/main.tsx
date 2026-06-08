import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import '@fontsource/bebas-neue';
import './index.css';
import App from './App';
import { ContentProvider } from './context/ContentContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContentProvider>
      <App />
    </ContentProvider>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'var(--clr-fire-maroon)',
          color: 'var(--clr-white)',
          borderRadius: '2px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          border: '1px solid var(--clr-primary)',
        },
        success: {
          iconTheme: { primary: 'var(--clr-fire-orange)', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: 'var(--clr-fire-red)', secondary: '#fff' },
        },
      }}
    />
  </StrictMode>
);
