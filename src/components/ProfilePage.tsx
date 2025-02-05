import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ProfileData {
  firstName: string;
  lastNameInitial: string;
  email: string;
  lookingFor: string;
  kids: string;
  zipcode: string;
  drinking: string;
  hobbies: string[];
  availability: string[];
  married: string;
  ageRange: string;
  friendAgeRange: string;
  pets: string;
  employed: string;
  work: string;
  political?: string;
  createdAt?: string;
}

const ProfilePage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // If there is an email query parameter, set it and fetch the profile.
    const emailQuery = searchParams.get('email');
    if (emailQuery) {
      setEmail(emailQuery);
      fetchProfile(emailQuery);
    }
  }, [searchParams]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const fetchProfile = async (emailToFetch: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/profile?email=${encodeURIComponent(emailToFetch)}`);
      if (!response.ok) {
        throw new Error('Profile not found');
      }
      const data = await response.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchProfile(email);
    // update the URL query string for bookmarking/sharing
    setSearchParams({ email });
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Email:
          <input type="email" value={email} onChange={handleEmailChange} required />
        </label>
        <button type="submit">Fetch Profile</button>
      </form>
      {loading && <p>Loading profile...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {profile && (
        <div style={{ marginTop: '20px' }}>
          <h2>
            {profile.firstName} {profile.lastNameInitial}
          </h2>
          <p>Email: {profile.email}</p>
          <p>Looking For: {profile.lookingFor}</p>
          <p>Kids: {profile.kids}</p>
          <p>Zipcode: {profile.zipcode}</p>
          <p>Drinking: {profile.drinking}</p>
          <p>Hobbies: {profile.hobbies.join(', ')}</p>
          <p>Availability: {profile.availability.join(', ')}</p>
          <p>Married: {profile.married}</p>
          <p>Age Range: {profile.ageRange}</p>
          <p>Friend Age Range: {profile.friendAgeRange}</p>
          <p>Pets: {profile.pets}</p>
          <p>Employed: {profile.employed}</p>
          <p>Work: {profile.work}</p>
          {profile.political && <p>Political Views: {profile.political}</p>}
          <p>Created At: {profile.createdAt}</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
