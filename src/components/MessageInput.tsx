// src/components/MessageInput.tsx
import React, { useState } from 'react';
import { createMessage } from '../services/chatService';

interface MessageInputProps {
  conversation: { id: string; user1Id: string; user2Id: string };
  senderId: string;
  onMessageSent: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversation, senderId, onMessageSent }) => {
  const [content, setContent] = useState('');

  const handleSendMessage = async () => {
    if (content.trim() === '') return;

    const recipientId =
      senderId === conversation.user1Id ? conversation.user2Id : conversation.user1Id;

    await createMessage(conversation.id, senderId, recipientId, content);
    setContent('');
    onMessageSent();
  };

  return (
    <div className="flex mt-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 border rounded-l"
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 text-white px-4 rounded-r"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;