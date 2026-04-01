import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { setProvider } from './services/provider';
import { SupabaseProvider } from './services/supabaseProvider';
import { LocalProvider } from './services/localProvider';
import './index.css';

function initProvider() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    setProvider(new SupabaseProvider());
  } else {
    setProvider(new LocalProvider());
  }
}

initProvider();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
