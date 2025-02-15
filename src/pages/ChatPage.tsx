import { useState, useEffect } from 'react';
import { chatService } from '../services/modelServices';

interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId] = useState('user1'); // In real app, get from auth
  const [receiverId] = useState('user2'); // In real app, get from route/props

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await chatService.getConversation(
        currentUserId,
        receiverId,
        { limit: 50 }
      );
      setMessages(response.items);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await chatService.create({
        senderId: currentUserId,
        receiverId,
        message: newMessage,
        timestamp: new Date()
      });
      setNewMessage('');
      loadMessages(); // Reload messages
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="chat-page">
      <h1>Chat</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}
          >
            <p>{msg.message}</p>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;