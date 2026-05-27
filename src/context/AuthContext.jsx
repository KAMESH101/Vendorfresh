/* eslint-disable react-refresh/only-export-components */
import { createContext } from 'react';
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-react';
import { isMockAuth } from '../lib/clerk';

export const AuthContext = createContext(null);

// Fallback Mock Auth Provider logic for local development
function MockAuthProvider({ children }) {
  const mockUser = {
    id: 'mock-user-id',
    email: 'farmer.admin@vendorfresh.com',
    name: 'Admin Manager',
    joinedAt: new Date().toISOString(),
  };

  const login = () => mockUser;
  const signup = () => mockUser;
  const logout = () => {};
  const isAuthenticated = true;

  return (
    <AuthContext.Provider value={{ user: mockUser, login, signup, logout, isAuthenticated, isMock: true }}>
      {children}
    </AuthContext.Provider>
  );
}

function ClerkAuthProvider({ children }) {
  const { isLoaded, userId, signOut } = useClerkAuth();
  const { user: clerkUser } = useClerkUser();

  const user = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    name: clerkUser.fullName || clerkUser.username || 'User',
    joinedAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : '',
  } : null;

  const login = () => {};
  const signup = () => {};
  const logout = () => signOut();
  const isAuthenticated = !!userId;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated, isMock: false, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }) {
  // If no live Clerk credentials are configured, fallback to mock authentication state
  if (isMockAuth) {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }

  return <ClerkAuthProvider>{children}</ClerkAuthProvider>;
}
