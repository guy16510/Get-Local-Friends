import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const LoginPage: React.FC = () => {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h2>Welcome, {user?.username}</h2>
            <button onClick={signOut} style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Sign Out</button>
          </div>
        </div>
      )}
    </Authenticator>
  );
};

export default LoginPage;
