import { useState } from 'react';

export const useGeoLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setError('Unable to retrieve location')
      );
    } else {
      setError('Geolocation not supported');
    }
  };

  return { location, getLocation, error };
};