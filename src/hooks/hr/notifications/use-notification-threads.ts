
import { useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";

export interface ThreadMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  attachments?: { name: string; url: string; type: string }[];
  read: boolean;
}

export interface NotificationThread {
  id: string;
  subject: string;
  participantIds: string[];
  messages: ThreadMessage[];
  createdAt: string;
  updatedAt: string;
  status: 'open' | 'closed' | 'pending';
  category: 'vacation' | 'shift' | 'reminder' | 'special' | 'general';
  relatedEntityId?: string; // ID of related request, shift, etc.
}

export function useNotificationThreads(currentUser: User) {
  const [threads, setThreads] = useState<NotificationThread[]>([]);
  const [loading, setLoading] = useState(true);

  // Load threads from localStorage
  useEffect(() => {
    const loadThreads = () => {
      setLoading(true);
      const savedThreads = localStorage.getItem('notification-threads');
      
      if (savedThreads) {
        // Filter threads where current user is a participant
        const parsedThreads = JSON.parse(savedThreads);
        const userThreads = parsedThreads.filter((thread: NotificationThread) => 
          thread.participantIds.includes(currentUser.id)
        );
        setThreads(userThreads);
      }
      
      setLoading(false);
    };

    loadThreads();
    
    // Listen for storage events (for multi-tab support)
    window.addEventListener('storage', loadThreads);
    return () => window.removeEventListener('storage', loadThreads);
  }, [currentUser.id]);

  // Save threads to localStorage
  const saveThreads = (updatedThreads: NotificationThread[]) => {
    // We need to load all threads first, then update only the ones modified
    const savedThreads = localStorage.getItem('notification-threads');
    const allThreads = savedThreads ? JSON.parse(savedThreads) : [];
    
    // Create a map of IDs to threads for easier updating
    const threadMap = new Map(allThreads.map((thread: NotificationThread) => [thread.id, thread]));
    
    // Update thread map with modified threads
    updatedThreads.forEach(thread => {
      threadMap.set(thread.id, thread);
    });
    
    // Convert map back to array and save
    localStorage.setItem('notification-threads', JSON.stringify(Array.from(threadMap.values())));
  };

  // Create a new thread
  const createThread = (
    subject: string, 
    initialMessage: string, 
    participants: string[], 
    category: NotificationThread['category'],
    relatedEntityId?: string
  ): NotificationThread => {
    if (!participants.includes(currentUser.id)) {
      participants.push(currentUser.id);
    }
    
    const now = new Date().toISOString();
    
    const newThread: NotificationThread = {
      id: crypto.randomUUID(),
      subject,
      participantIds: participants,
      messages: [{
        id: crypto.randomUUID(),
        content: initialMessage,
        senderId: currentUser.id,
        senderName: `${currentUser.name}`,
        timestamp: now,
        read: false
      }],
      createdAt: now,
      updatedAt: now,
      status: 'open',
      category,
      relatedEntityId
    };
    
    const updatedThreads = [...threads, newThread];
    setThreads(updatedThreads);
    saveThreads(updatedThreads);
    
    toast({
      title: "Conversación creada",
      description: "Se ha iniciado una nueva conversación."
    });
    
    return newThread;
  };

  // Add a message to a thread
  const addMessage = (
    threadId: string, 
    content: string, 
    attachments?: ThreadMessage['attachments']
  ) => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return null;
    
    const now = new Date().toISOString();
    
    const newMessage: ThreadMessage = {
      id: crypto.randomUUID(),
      content,
      senderId: currentUser.id,
      senderName: `${currentUser.name}`,
      timestamp: now,
      attachments,
      read: false
    };
    
    const updatedThread = {
      ...thread,
      messages: [...thread.messages, newMessage],
      updatedAt: now,
      status: 'pending' // Change status to indicate new activity
    };
    
    const updatedThreads = threads.map(t => 
      t.id === threadId ? updatedThread : t
    );
    
    setThreads(updatedThreads);
    saveThreads(updatedThreads);
    
    return newMessage;
  };

  // Mark messages as read in a thread
  const markThreadAsRead = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;
    
    const updatedMessages = thread.messages.map(message => 
      message.senderId !== currentUser.id && !message.read
        ? { ...message, read: true }
        : message
    );
    
    const updatedThread = {
      ...thread,
      messages: updatedMessages,
      status: 'open' // Reset status to open since it's been read
    };
    
    const updatedThreads = threads.map(t => 
      t.id === threadId ? updatedThread : t
    );
    
    setThreads(updatedThreads);
    saveThreads(updatedThreads);
  };

  // Close a thread
  const closeThread = (threadId: string) => {
    const updatedThreads = threads.map(thread => 
      thread.id === threadId 
        ? { ...thread, status: 'closed' as const } 
        : thread
    );
    
    setThreads(updatedThreads);
    saveThreads(updatedThreads);
    
    toast({
      title: "Conversación cerrada",
      description: "La conversación ha sido cerrada correctamente."
    });
  };

  // Get unread counts
  const getUnreadCounts = () => {
    const unreadThreads = threads.filter(thread => 
      thread.messages.some(message => 
        message.senderId !== currentUser.id && !message.read
      )
    ).length;
    
    const totalUnreadMessages = threads.reduce((count, thread) => {
      const unreadInThread = thread.messages.filter(message => 
        message.senderId !== currentUser.id && !message.read
      ).length;
      
      return count + unreadInThread;
    }, 0);
    
    return {
      unreadThreads,
      totalUnreadMessages
    };
  };

  return {
    threads,
    loading,
    createThread,
    addMessage,
    markThreadAsRead,
    closeThread,
    getUnreadCounts
  };
}
