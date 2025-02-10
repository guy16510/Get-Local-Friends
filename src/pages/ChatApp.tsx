// src/components/ChatApp.tsx
import React, { useState, useEffect } from 'react';
import { getConversations } from '../services/chatService';
import ConversationList from '../components/ConversationList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

interface User {
  id: string;
  name: string;
}

interface Conversation {
  id: string;
  user1Id: string;
  user2Id: string;
}

const ChatApp: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const response: any = await getConversations(currentUser.id);
      setConversations(response.data);
    };
    fetchConversations();
  }, [currentUser.id]);

  return (
    <div className="flex h-screen bg-gray-100">
      <ConversationList
        conversations={conversations}
        onSelect={setActiveConversation}
        currentUser={currentUser}
      />
      {activeConversation && (
        <div className="flex flex-col w-full p-4">
          <MessageList conversation={activeConversation} />
          <MessageInput
            conversation={activeConversation}
            senderId={currentUser.id}
            onMessageSent={() => setActiveConversation({ ...activeConversation })}
          />
        </div>
      )}
    </div>
  );
};

export default ChatApp;
