
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('worker');

  useEffect(() => {
    // First check localStorage for demo user
    const demoUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole') as UserRole;
    
    if (demoUser) {
      try {
        const userData = JSON.parse(demoUser);
        setUser(userData);
        
        if (storedRole) {
          setUserRole(storedRole);
        }
        
        setLoading(false);
        return;
      } catch (err) {
        console.error('Error parsing demo user:', err);
        // Continue to regular auth check if demo user parsing fails
      }
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Update user role from metadata or localStorage
        if (session?.user?.user_metadata?.role) {
          setUserRole(session.user.user_metadata.role as UserRole);
        } else if (storedRole) {
          setUserRole(storedRole);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Update user role from metadata or localStorage
      if (session?.user?.user_metadata?.role) {
        setUserRole(session.user.user_metadata.role as UserRole);
      } else if (storedRole) {
        setUserRole(storedRole);
      }
      
      setLoading(false);
    }).catch(err => {
      console.error('Error getting auth session:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    error,
    userRole,
    setUserRole
  };
}
