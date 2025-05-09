
import { ChatMessage, ChatConversation } from "@/types/chat";
import { exampleUser, exampleWorkers } from "./example-users";

// Create some example messages
export const exampleMessages: ChatMessage[] = [
  {
    id: "1",
    senderId: exampleUser.id,
    receiverId: exampleWorkers[0].id,
    content: "Buenos días Ana, ¿cómo va todo con tu solicitud de vacaciones?",
    timestamp: new Date("2024-05-08T09:00:00"),
  },
  {
    id: "2",
    senderId: exampleWorkers[0].id,
    receiverId: exampleUser.id,
    content: "¡Hola! Todo bien, gracias. Esperando la confirmación.",
    timestamp: new Date("2024-05-08T09:05:00"),
  },
  {
    id: "3",
    senderId: exampleUser.id,
    receiverId: exampleWorkers[0].id,
    content: "Excelente. Revisaré el estado hoy mismo y te confirmo.",
    timestamp: new Date("2024-05-08T09:07:00"),
  },
  {
    id: "4",
    senderId: exampleWorkers[0].id,
    receiverId: exampleUser.id,
    content: "Perfecto, muchas gracias. Estoy pendiente entonces.",
    timestamp: new Date("2024-05-08T09:10:00"),
  },
  {
    id: "5",
    senderId: exampleUser.id,
    receiverId: exampleWorkers[1].id,
    content: "Hola Carlos, necesito que me envíes tu reporte de horas extra del mes pasado.",
    timestamp: new Date("2024-05-08T10:15:00"),
  },
  {
    id: "6",
    senderId: exampleWorkers[1].id,
    receiverId: exampleUser.id,
    content: "Claro, lo enviaré hoy sin falta.",
    timestamp: new Date("2024-05-08T10:30:00"),
  },
  {
    id: "7",
    senderId: exampleUser.id,
    receiverId: exampleWorkers[2].id,
    content: "María, tengo una duda sobre tu último turno. ¿Podrías llamarme cuando estés disponible?",
    timestamp: new Date("2024-05-09T08:45:00"),
  },
  {
    id: "8",
    senderId: exampleWorkers[2].id,
    receiverId: exampleUser.id,
    content: "Buenos días. Claro, ¿a qué hora te viene bien?",
    timestamp: new Date("2024-05-09T08:55:00"),
  }
];

// Create conversations for each worker
export const exampleConversations: ChatConversation[] = exampleWorkers.slice(0, 5).map((worker, index) => ({
  id: `conv-${worker.id}`,
  participants: [exampleUser.id, worker.id],
  lastMessage: exampleMessages.find(m => 
    (m.senderId === worker.id && m.receiverId === exampleUser.id) || 
    (m.senderId === exampleUser.id && m.receiverId === worker.id)
  ),
}));
