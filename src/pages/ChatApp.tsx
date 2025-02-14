import React, { useState, useEffect } from 'react';

interface ChatMessage {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: number;
}

const Chat: React.FC = () => {
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState('');

  const fetchMessages = async () => {
    if (senderId && receiverId) {
      try {
        const response = await fetch(
          `/chat?senderId=${encodeURIComponent(senderId)}&receiverId=${encodeURIComponent(receiverId)}`
        );
        const data = await response.json();
        setMessages(data.data || []);
      } catch (error) {
        setStatus('Error fetching messages.');
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId,
          receiverId,
          message: messageText,
          timestamp: Date.now(),
        }),
      });
      await response.json();
      setStatus('Message sent!');
      setMessageText('');
      fetchMessages();
    } catch (error) {
      setStatus('Failed to send message.');
    }
  };

  useEffect(() => {
    if (senderId && receiverId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [senderId, receiverId]);

  return (
    <div>
      <h2>Chat</h2>
      <div>
        <label>Sender ID:</label>
        <input value={senderId} onChange={(e) => setSenderId(e.target.value)} />
      </div>
      <div>
        <label>Receiver ID:</label>
        <input value={receiverId} onChange={(e) => setReceiverId(e.target.value)} />
      </div>
      <form onSubmit={handleSendMessage}>
        <div>
          <label>Message:</label>
          <input value={messageText} onChange={(e) => setMessageText(e.target.value)} required />
        </div>
        <button type="submit">Send</button>
      </form>
      {status && <p>{status}</p>}
      <div>
        <h3>Chat Messages</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.senderId}:</strong> {msg.message}{' '}
              <em>({new Date(msg.timestamp).toLocaleTimeString()})</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;