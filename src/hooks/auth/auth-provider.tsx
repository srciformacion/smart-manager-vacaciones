
import { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './use-auth-state';
import { signIn, signOut, signUp } from './auth-actions';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { 
    user, 
    session, 
    loading, 
    error, 
    userRole, 
    setUserRole 
  } = useAuthState();

  const handleSignIn = async (email: string, password: string) => {
    return signIn(email, password, userRole);
  };

  const handleSignUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    return signUp(email, password, userRole, metadata);
  };

  const handleSignOut = async () => {
    return signOut();
  };

  // Fix the error by ensuring error has the correct type
  const errorMessage = error ? error.message || 'An unknown error occurred' : null;

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        session, 
        loading, 
        error: errorMessage, 
        signIn: handleSignIn, 
        signUp: handleSignUp, 
        signOut: handleSignOut, 
        userRole, 
        setUserRole 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
