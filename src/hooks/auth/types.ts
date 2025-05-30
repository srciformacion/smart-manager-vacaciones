
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'worker' | 'hr';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<any>;
  signOut: () => Promise<void>;
  userRole?: UserRole;
  setUserRole: (role: UserRole) => void;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: any;
  userRole?: UserRole;
}
