import React from 'react';
import { useLocation } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import { UserProfile } from '../types';

const ProfilePage: React.FC = () => {
  const location = useLocation();
  const profile = location.state as UserProfile;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Profile Details</h1>
      {profile ? <ProfileCard profile={profile} /> : <p>No profile data found.</p>}
    </div>
  );
};

export default ProfilePage;