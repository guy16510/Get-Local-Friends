import { useState } from 'react';
import { addUserToPremiumGroup } from '../services/premiumGroupApi';
import { geoItemService } from '../services/modelServices';

const PremiumPage = () => {
  const [status, setStatus] = useState({ message: '', error: false });
  const [isLoading, setIsLoading] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      await addUserToPremiumGroup();
      setStatus({ 
        message: 'Successfully upgraded to premium!', 
        error: false 
      });
      // After upgrade, search for nearby users
      await searchNearbyUsers();
    } catch (error) {
      setStatus({ 
        message: 'Failed to upgrade. Please try again.', 
        error: true 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchNearbyUsers = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await geoItemService.searchByLocation(
            position.coords.latitude,
            position.coords.longitude,
            5000 // 5km radius
          );
          setNearbyUsers(response.items);
        } catch (error) {
          console.error('Failed to fetch nearby users:', error);
        }
      });
    }
  };

  return (
    <div className="premium-page">
      <h1>Upgrade to Premium</h1>
      <div className="premium-features">
        <h2>Premium Features:</h2>
        <ul>
          <li>Find users nearby</li>
          <li>Advanced chat features</li>
          <li>Priority support</li>
        </ul>
      </div>
      <button 
        onClick={handleUpgrade}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Upgrade Now'}
      </button>
      {status.message && (
        <p className={status.error ? 'error' : 'success'}>
          {status.message}
        </p>
      )}
      {nearbyUsers.length > 0 && (
        <div className="nearby-users">
          <h2>Nearby Users</h2>
          <ul>
            {nearbyUsers.map((user, index) => (
              <li key={index}>
                User at {user.lat.toFixed(2)}, {user.lng.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PremiumPage;