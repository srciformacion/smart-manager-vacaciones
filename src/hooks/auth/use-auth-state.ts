
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
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // First check localStorage for demo user
        const demoUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('userRole') as UserRole;
        
        if (demoUser) {
          try {
            const userData = JSON.parse(demoUser);
            console.log("Auth state - Found demo user:", userData);
            
            if (mounted) {
              setUser(userData);
              
              if (storedRole) {
                console.log("Auth state - Setting role from localStorage:", storedRole);
                setUserRole(storedRole);
              } else if (userData.role) {
                console.log("Auth state - Setting role from user data:", userData.role);
                setUserRole(userData.role);
              }
              
              setLoading(false);
            }
            return;
          } catch (err) {
            console.error('Error parsing demo user:', err);
            // Continue to regular auth check if demo user parsing fails
          }
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return;
            
            console.log("Auth state change event:", event, session?.user?.email);
            setSession(session);
            setUser(session?.user ?? null);
            
            // Update user role from metadata or localStorage
            if (session?.user?.user_metadata?.role) {
              const role = session.user.user_metadata.role as UserRole;
              console.log("Auth state - Setting role from metadata:", role);
              setUserRole(role);
              localStorage.setItem('userRole', role);
            } else if (storedRole) {
              console.log("Auth state - Using stored role:", storedRole);
              setUserRole(storedRole);
            }
            
            setLoading(false);
          }
        );

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          console.log("Initial session check:", session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          
          // Update user role from metadata or localStorage
          if (session?.user?.user_metadata?.role) {
            const role = session.user.user_metadata.role as UserRole;
            console.log("Initial session - Setting role from metadata:", role);
            setUserRole(role);
            localStorage.setItem('userRole', role);
          } else if (storedRole) {
            console.log("Initial session - Using stored role:", storedRole);
            setUserRole(storedRole);
          }
          
          setLoading(false);
        }

        return () => {
          subscription?.unsubscribe();
        };
      } catch (err) {
        console.error('Error getting auth session:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
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
