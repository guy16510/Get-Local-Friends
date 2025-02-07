import React from 'react';

const Loader: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <div className="loader" style={{ border: '4px solid #f3f3f3', borderRadius: '50%', borderTop: '4px solid #007BFF', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
  </div>
);

export default Loader;