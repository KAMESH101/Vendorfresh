/* eslint-disable react-refresh/only-export-components */
import { createContext } from 'react';
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
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
