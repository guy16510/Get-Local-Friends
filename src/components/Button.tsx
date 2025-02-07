import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '0.5rem 1rem',
      backgroundColor: disabled ? '#ccc' : '#007BFF',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}
  >
    {children}
  </button>
);

export default Button;