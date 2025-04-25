
export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  attachmentName?: string;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
}
