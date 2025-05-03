
import { Database } from "@/integrations/supabase/types";

// Define additional types that extend the generated Supabase types
export type ProfileWithPreferences = Database["public"]["Tables"]["profiles"]["Row"] & {
  preferred_notification_channel?: string;
  notification_channels?: string[];
  notification_consent?: boolean;
};

// Add any other custom types that you need here without modifying the auto-generated types
export type SupabaseProfile = Database["public"]["Tables"]["profiles"]["Row"];

// Define types for inserts and updates
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// Export convenience types from the generated file to use throughout the application
export type { Database } from "@/integrations/supabase/types";
