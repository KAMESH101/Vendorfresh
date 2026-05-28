import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { clerkPubKey } from './lib/clerk';
import App from './App.jsx';
import './index.css';

const rootElement = createRoot(document.getElementById('root'));

rootElement.render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </StrictMode>
);

