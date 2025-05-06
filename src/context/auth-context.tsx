
import React, { ReactNode } from 'react';
import { AuthProvider as AuthProviderOriginal } from '@/hooks/auth/auth-provider';

interface AuthProviderProps {
  children: ReactNode;
}

// Simple wrapper around the original AuthProvider to maintain compatibility
export function AuthProvider({ children }: AuthProviderProps) {
  return <AuthProviderOriginal>{children}</AuthProviderOriginal>;
}

// Re-export the useAuth hook from the original auth provider
export { useAuth } from '@/hooks/auth/auth-provider';
