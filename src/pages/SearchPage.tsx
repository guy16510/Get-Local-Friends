import React, { useState, useEffect } from 'react';
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { GeoDataManager, GeoDataManagerConfiguration } from "dynamodb-geo-v3";
import { fetchAuthSession } from 'aws-amplify/auth';

const SearchPage: React.FC = () => {
  const [ddbClient, setDdbClient] = useState<DynamoDB | null>(null);
  const [latitude, setLatitude] = useState('40.7128'); // Example
  const [longitude, setLongitude] = useState('-74.0060'); // Example
  const [radius, setRadius] = useState('5000');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDynamoDB = async () => {
      try {
        const session = await fetchAuthSession();
        const credentials = session.credentials;
        console.log('[initializeDynamoDB] session:', session);

        const client = new DynamoDB({
          region: 'us-east-1',
          credentials: {
            accessKeyId: credentials?.accessKeyId || '',
            secretAccessKey: credentials?.secretAccessKey || '',
            sessionToken: credentials?.sessionToken || '',
          },
          // You can add a logger to see internal AWS SDK logs
          // logger: console,
        });
        console.log('[initializeDynamoDB] Created DynamoDB client:', client.config);

        setDdbClient(client);
      } catch (err) {
        console.error('[initializeDynamoDB] Error fetching credentials:', err);
        setError('Failed to initialize DynamoDB client.');
      }
    };
    initializeDynamoDB();
  }, []);

  const fetchProfilesByGeo = async () => {
    if (!ddbClient) {
      setError('DynamoDB client not initialized');
      return;
    }

    setError(null);

    console.log('[fetchProfilesByGeo] Starting query', {
      latitude,
      longitude,
      radius,
    });

    try {
      const geoConfig = new GeoDataManagerConfiguration(ddbClient, "GeoUserProfileTable");
      // Confirm your table name and region are correct
      geoConfig.hashKeyLength = 3; // Adjust if needed

      console.log('[fetchProfilesByGeo] geoConfig:', {
        tableName: geoConfig.tableName,
        hashKeyLength: geoConfig.hashKeyLength,
      });

      // If you want more insight, set a debugger here or log the `geoConfig`
      const geoDataManager = new GeoDataManager(geoConfig);

      // Some logging:
      console.log('[fetchProfilesByGeo] About to call queryRadius with:', {
        RadiusInMeter: Number(radius),
        CenterPoint: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
      });

      const geoResponse: any = await geoDataManager.queryRadius({
        RadiusInMeter: Number(radius),
        CenterPoint: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
      });

      console.log('[fetchProfilesByGeo] queryRadius response:', geoResponse);

      // See if .items is present
      if (!geoResponse.items) {
        console.warn('[fetchProfilesByGeo] geoResponse has no .items');
      } else {
        console.log('[fetchProfilesByGeo] item count:', geoResponse.items.length);
      }

      setResults(geoResponse.items || []);
    } catch (err: any) {
      console.error('[fetchProfilesByGeo] Error:', err);
      setError(err.message || 'Error fetching profiles');
    }
  };

  return (
    <div>
      <h2>Search Page</h2>
      <div>
        <label>Lat:</label>
        <input
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
      </div>
      <div>
        <label>Lng:</label>
        <input
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
      </div>
      <div>
        <label>Radius (meters):</label>
        <input
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        />
      </div>
      <button onClick={fetchProfilesByGeo}>Search</button>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        {results.map((item, idx) => (
          <div key={idx}>
            {JSON.stringify(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;