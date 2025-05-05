
import { useEffect, useState } from "react";
import { RealTimeRequests } from "@/components/hr/requests-management/realtime-requests";
import { enableRealtimeForTable, RealtimeConfig } from "@/utils/realtime-utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RealtimeTabContentProps {
  isActive: boolean;
}

export function RealtimeTabContent({ isActive }: RealtimeTabContentProps) {
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(false);

  useEffect(() => {
    // Enable realtime for requests table when the tab is active
    if (isActive && !isRealtimeEnabled) {
      enableRealtime();
    }

    return () => {
      // Clean up realtime subscriptions when component unmounts
      if (isRealtimeEnabled) {
        supabase.removeAllChannels();
        setIsRealtimeEnabled(false);
      }
    };
  }, [isActive, isRealtimeEnabled]);

  const enableRealtime = async () => {
    try {
      const realtimeConfig: RealtimeConfig = {
        table: "requests",
        event: "*"
      };
      
      const result = await enableRealtimeForTable(supabase, realtimeConfig);
      
      if (result.success) {
        setIsRealtimeEnabled(true);
        toast.success("Notificaciones en tiempo real activadas");
      } else {
        toast.error(`Error al activar notificaciones: ${result.error?.message}`);
      }
    } catch (error) {
      console.error("Error enabling realtime:", error);
      toast.error("Error al activar notificaciones en tiempo real");
    }
  };

  return <RealTimeRequests />;
}
