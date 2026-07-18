import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';

import App from './App';

import './index.css';

if (import.meta.env.DEV) {
  setBaseUrl('http://localhost:5000');
}

createRoot(document.getElementById('root')!).render(<App />);
