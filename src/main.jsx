import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { clerkPubKey, isMockAuth } from './lib/clerk';
import App from './App.jsx';
import './index.css';

const rootElement = createRoot(document.getElementById('root'));

if (isMockAuth) {
  // During mock local development, run App directly without Clerk errors
  rootElement.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  rootElement.render(
    <StrictMode>
      <ClerkProvider publishableKey={clerkPubKey}>
        <App />
      </ClerkProvider>
    </StrictMode>
  );
}

