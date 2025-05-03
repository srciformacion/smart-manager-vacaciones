
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(() => {
    // Initialize from localStorage if available
    return (localStorage.getItem('userRole') as UserRole) || 'worker';
  });

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

  return {
    user,
    session,
    loading,
    error,
    userRole,
    setUserRole
  };
}
