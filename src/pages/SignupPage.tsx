import { useState, useEffect } from 'react';
// import { geoItemService } from '../services/modelServices';
import * as API from '@aws-amplify/api-rest';

const SignUpPage = () => {
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  // const [userId] = useState<string>('fdsoij'); // In real app, get from auth
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
      // await geoItemService.create({
      //   lat: location.lat,
      //   lng: location.lng,
      //   userId,
      //   hashKey: `${location.lat}-${location.lng}`,
      //   rangeKey: new Date().toISOString()
      // });

              const { response } = API.post({
                apiName: 'myRestApi',
                path: 'geo',
                options: {
                  body: {
                  lat: location.lat,
                  lng: location.lng,
                  userId: "user123",
                  hashKey: `${location.lat}-${location.lng}`,
                  rangeKey: new Date().toISOString()
                }}
              });
              const res = await response;
              const json = await res.body.json();
              console.log(json);

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