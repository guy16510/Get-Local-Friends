import React, { useState, useEffect } from 'react';
import * as API from '@aws-amplify/api-rest';
import { useGeoLocation } from '../services/geoService';

const Signup: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [message, setMessage] = useState('');

  const { location, getLocation, error: geoError } = useGeoLocation();

  // When location is fetched, update the form fields.
  useEffect(() => {
    if (location) {
      setLat(location.lat.toString());
      setLng(location.lng.toString());
    }
  }, [location]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const restOperation = API.post({
        apiName: 'myRestApi',
        path: 'geo',
        options: {
          body: {
            userId,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
          },
        }
      });
  
      const { body } = await restOperation.response;
      const response = await body.json();

      debugger;
      setMessage('Signup successful!');
      console.log('Response:', response);
    } catch (err) {
      console.error('Error during signup:', err);
      setMessage('Signup failed!');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>User ID:</label>
          <input 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Latitude:</label>
          <input 
            value={lat} 
            onChange={(e) => setLat(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Longitude:</label>
          <input 
            value={lng} 
            onChange={(e) => setLng(e.target.value)} 
            required 
          />
        </div>
        <div>
          <button type="button" onClick={getLocation}>
            Get My Location
          </button>
        </div>
        <button type="submit">Signup</button>
      </form>
      {geoError && <p style={{ color: 'red' }}>Geo Error: {geoError}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;