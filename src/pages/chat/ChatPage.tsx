
import { MainLayout } from "@/components/layout/main-layout";
import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatProvider } from "@/context/chat-context";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const { user, fetchAuthUser } = useProfileAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const authUser = await fetchAuthUser();
      if (!authUser) {
        navigate('/auth');
      }
    };
    
    checkAuth();
  }, [fetchAuthUser, navigate]);

  return (
    <ChatProvider>
      <MainLayout user={user}>
        <ChatLayout />
      </MainLayout>
    </ChatProvider>
  );
}
