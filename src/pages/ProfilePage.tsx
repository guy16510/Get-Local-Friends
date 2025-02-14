import React, { useState } from 'react';

const Profile: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [message, setMessage] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Fetch using geo-api's userId lookup (ensure a GSI exists)
      const response = await fetch(`/geo?userId=${encodeURIComponent(userId)}`);
      const data = await response.json();
      // Assume data.data is an array of profile objects.
      setProfile(data.data ? data.data[0] : null);
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