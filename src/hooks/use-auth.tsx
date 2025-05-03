
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<any>;
  signOut: () => Promise<void>;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(() => {
    // Initialize from localStorage if available
    return (localStorage.getItem('userRole') as UserRole) || 'worker';
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Only execute additional logic inside setTimeout to prevent deadlocks
        if (currentSession?.user) {
          setTimeout(() => {
            // Get the stored role or default to worker
            const storedRole = localStorage.getItem('userRole') as UserRole || 'worker';
            console.log("Setting role from localStorage:", storedRole);
            setUserRole(storedRole);
          }, 0);
        }
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? "Session found" : "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Get the stored role or default to worker
        const storedRole = localStorage.getItem('userRole') as UserRole || 'worker';
        console.log("Setting initial role from localStorage:", storedRole);
        setUserRole(storedRole);
      }
      
      setLoading(false);
    }).catch((err) => {
      console.error('Error getting session:', err);
      setError('Error getting session');
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Effect to update localStorage when userRole changes
  useEffect(() => {
    if (userRole) {
      console.log("Saving role to localStorage:", userRole);
      localStorage.setItem("userRole", userRole);
    }
  }, [userRole]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error("Error de autenticación: " + error.message);
        throw error;
      }

      if (data.user) {
        // Store role in localStorage for consistency
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userEmail", email);
        
        // Redirect to welcome page instead of dashboard
        setTimeout(() => {
          navigate('/welcome');
        }, 0);
      }

      return data;
    } catch (err) {
      console.error('Sign in error:', err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('Unknown error signing in');
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            ...metadata,
            role: userRole // Store role in user metadata
          }
        }
      });

      if (error) {
        toast.error("Error de registro: " + error.message);
        throw error;
      }

      if (data.user) {
        toast.success("Cuenta creada con éxito. Ya puedes iniciar sesión con tus credenciales.");
      }

      return data;
    } catch (err) {
      console.error('Sign up error:', err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('Unknown error signing up');
    }
  };

  const signOut = async () => {
    try {
      // First clear localStorage to ensure state is reset
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("user");
      
      // Reset state before calling Supabase signOut
      setUser(null);
      setSession(null);
      
      // Then sign out from Supabase - handle potential errors gracefully
      try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          console.error(`Error during Supabase signOut:`, error.message);
          // Continue with redirection despite Supabase error
        }
      } catch (err) {
        // Log but don't throw - we still want to complete the local logout
        console.error('Error: Sign out error:', err);
      }
      
      // Success notification
      toast.success("Has cerrado la sesión correctamente");
      
      // Navigate using replace to prevent going back with browser history
      navigate('/auth', { replace: true });
      
    } catch (err) {
      console.error('Sign out complete error:', err);
      toast.error('Error al cerrar sesión');
      // Still redirect to auth page even if there was an error
      navigate('/auth', { replace: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        session, 
        loading, 
        error, 
        signIn, 
        signUp, 
        signOut, 
        userRole, 
        setUserRole 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
