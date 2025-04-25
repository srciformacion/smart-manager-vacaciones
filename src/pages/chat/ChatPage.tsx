
import { MainLayout } from "@/components/layout/main-layout";
import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatProvider } from "@/context/chat-context";

export default function ChatPage() {
  return (
    <ChatProvider>
      <MainLayout>
        <ChatLayout />
      </MainLayout>
    </ChatProvider>
  );
}
