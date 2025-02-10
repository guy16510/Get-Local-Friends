// src/components/MessageList.tsx
import React, { useEffect, useState } from 'react';
import { getMessages } from '../services/chatService';

interface MessageListProps {
  conversation: { id: string; user1Id: string; user2Id: string };
}

const MessageList: React.FC<MessageListProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response: any = await getMessages(conversation.id);
      setMessages(response.data);
    };
    fetchMessages();
  }, [conversation]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded shadow-sm">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-2 my-1 ${
            message.senderId === conversation.user1Id
              ? 'text-right bg-blue-200'
              : 'text-left bg-green-200'
          } rounded`}
        >
          <strong>{message.senderId}:</strong> {message.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
