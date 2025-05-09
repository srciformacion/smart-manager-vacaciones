
import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatProvider } from "@/context/chat-context";
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { exampleUser } from "@/data/example-users";

export default function ChatPage() {
  const { user, fetchAuthUser } = useProfileAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authUser = await fetchAuthUser();
        if (!authUser) {
          toast.error("Por favor inicia sesión para acceder al chat");
          navigate('/');
          return;
        }
        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Error al verificar autenticación");
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [fetchAuthUser, navigate]);

  if (loading) {
    return (
      <MainLayout user={exampleUser}>
        <div className="space-y-6">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-[500px]" />
        </div>
      </MainLayout>
    );
  }

  return (
    <ChatProvider>
      <MainLayout user={user}>
        <ChatLayout />
      </MainLayout>
    </ChatProvider>
  );
}
