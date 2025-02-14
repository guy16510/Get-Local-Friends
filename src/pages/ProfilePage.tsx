import React, { useState } from 'react';
import * as API from '@aws-amplify/api-rest';

const Profile: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [message, setMessage] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const restOperation = API.get({
        apiName: 'myRestApi',
        path: `geo?userId=${encodeURIComponent(userId)}`,
      });
      
      // Wait for the response and then extract its body.
      const { body } = await restOperation.response;
      const response = await body.json();
      
      // Assume that the response contains a "data" property which is an array
      // of profiles. Otherwise, adjust as needed.
      setProfile(response);
      setMessage('Profile loaded.');
    } catch (error) {
      setMessage('Error loading profile.');
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleLookup}>
        <div>
          <label>User ID:</label>
          <input value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </div>
        <button type="submit">Load Profile</button>
      </form>
      {message && <p>{message}</p>}
      {profile && (
        <div>
          <h3>Profile Data</h3>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Profile;