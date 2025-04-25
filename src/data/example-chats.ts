
import { ChatMessage, ChatConversation } from "@/types/chat";
import { exampleUser, exampleWorkers } from "./example-users";

export const exampleMessages: ChatMessage[] = [
  {
    id: "1",
    senderId: exampleUser.id,
    receiverId: exampleWorkers[0].id,
    content: "Buenos días Ana, ¿cómo va todo con tu solicitud de vacaciones?",
    timestamp: new Date("2024-04-24T09:00:00"),
  },
  {
    id: "2",
    senderId: exampleWorkers[0].id,
    receiverId: exampleUser.id,
    content: "¡Hola! Todo bien, gracias. Esperando la confirmación.",
    timestamp: new Date("2024-04-24T09:05:00"),
  },
];

export const exampleConversations: ChatConversation[] = exampleWorkers.map(worker => ({
  id: `conv-${worker.id}`,
  participants: [exampleUser.id, worker.id],
  lastMessage: exampleMessages.find(m => 
    m.senderId === worker.id || m.receiverId === worker.id
  ),
}));
