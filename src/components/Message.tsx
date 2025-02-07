import React from 'react';

interface MessageProps {
  children: React.ReactNode;
  type?: 'error' | 'success' | 'info';
}

const Message: React.FC<MessageProps> = ({ children, type = 'info' }) => {
  const colors = {
    error: '#FF6B6B',
    success: '#4CAF50',
    info: '#007BFF',
  };

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: colors[type],
        color: 'white',
        borderRadius: '4px',
        marginBottom: '1rem',
      }}
    >
      {children}
    </div>
  );
};

export default Message;