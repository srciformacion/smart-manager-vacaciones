
import { useAuth } from "@/hooks/auth/auth-provider";
import { User } from "@/types";

export function useProfileAuth() {
  const { user: authUser, userRole } = useAuth();
  
  // Convert auth user to app User type
  const user: User | null = authUser ? {
    id: authUser.id,
    name: authUser.user_metadata?.name || "Usuario",
    email: authUser.email || "",
    role: userRole || authUser.user_metadata?.role || "worker",
  } : null;
  
  return { user };
}
