
import { Database, Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Define additional types that extend the generated Supabase types
export type ProfileWithPreferences = Tables<"profiles"> & {
  preferred_notification_channel?: string;
  notification_channels?: string[];
  notification_consent?: boolean;
};

// Add any other custom types that you need here without modifying the auto-generated types
export type SupabaseProfile = Tables<"profiles">;

// Define types for inserts and updates
export type ProfileInsert = TablesInsert<"profiles">;
export type ProfileUpdate = TablesUpdate<"profiles">;

// Export convenience types from the generated file to use throughout the application
export type { Database } from "@/integrations/supabase/types";

