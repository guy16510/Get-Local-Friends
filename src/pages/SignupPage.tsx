import { useState, useEffect } from 'react';
import { geoItemService } from '../services/modelServices';

const SignUpPage = () => {
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [userId] = useState<string>(''); // In real app, get from auth
  const [status, setStatus] = useState({ message: '', error: false });

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setStatus({ 
            message: 'Failed to get location. Please enable location services.', 
            error: true
          });
        }
      );
    }
  }, []);

  const handleSignUp = async () => {
    if (!location) return;

    try {
      await geoItemService.create({
        lat: location.lat,
        lng: location.lng,
        userId,
        hashKey: `${location.lat}-${location.lng}`,
        rangeKey: new Date().toISOString()
      });
      setStatus({ message: 'Location registered successfully!', error: false });
    } catch (error) {
      setStatus({ 
        message: 'Failed to register location. Please try again.', 
        error: true 
      });
    }
  };

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      {location ? (
        <div>
          <p>Location detected:</p>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
          <button onClick={handleSignUp}>Complete Registration</button>
        </div>
      ) : (
        <p>Detecting location...</p>
      )}
      {status.message && (
        <p className={status.error ? 'error' : 'success'}>
          {status.message}
        </p>
      )}
    </div>
  );
};

export default SignUpPage;