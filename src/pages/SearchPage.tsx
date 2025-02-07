import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  Heading,
  TextField,
  View,
  Text,
  Loader,
} from '@aws-amplify/ui-react';
// import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import { GeoUserProfile } from '../types';
// import { useGeoLocation } from '../hooks/useGeoLocation';
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { GeoDataManager, GeoDataManagerConfiguration } from "dynamodb-geo-v3";
import { fetchAuthSession } from 'aws-amplify/auth';

// const PAGE_SIZE = 10;
// const STORAGE_KEYS = {
//   lat: 'search_latitude',
//   lng: 'search_longitude',
//   radius: 'search_radius',
//   filters: 'search_filters',
//   results: 'search_results',
//   nextToken: 'search_nextToken',
//   currentPage: 'search_currentPage',
// };

const SearchPage: React.FC = () => {
  // const navigate = useNavigate();
  // const { location: browserLocation, getLocation: getBrowserLocation, error: geoError } = useGeoLocation();

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('5000');
  const [results, setResults] = useState<GeoUserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ddbClient, setDdbClient] = useState<DynamoDB | null>(null);

  useEffect(() => {
    const initializeDynamoDB = async () => {
      try {
        const session = await fetchAuthSession();
        const credentials = session.credentials;
        const client = new DynamoDB({
          region: 'us-east-1',
          credentials: {
            accessKeyId: credentials?.accessKeyId || '',
            secretAccessKey: credentials?.secretAccessKey || '',
            sessionToken: credentials?.sessionToken || ''
          },
        });
        setDdbClient(client);
      } catch (err) {
        console.error('Error fetching credentials:', err);
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

    setIsLoading(true);
    setError(null);

    try {
      const geoConfig = new GeoDataManagerConfiguration(ddbClient, "GeoUserProfileTable");
      geoConfig.hashKeyLength = 3;
      const geoDataManager = new GeoDataManager(geoConfig);

      const geoResponse:any = await geoDataManager.queryRadius({
        RadiusInMeter: parseFloat(radius),
        CenterPoint: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        // Limit: PAGE_SIZE,
      });
      debugger;
      setResults(geoResponse.items);
    } catch (err: any) {
      setError(err.message || 'Error fetching profiles');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View padding="2rem">
      <Heading level={1}>Find People Near You</Heading>
      <Flex direction="column" gap="1rem">
        <TextField
          label="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <TextField
          label="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        <TextField
          label="Radius (meters)"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        />
        <Button onClick={fetchProfilesByGeo} variation="primary">Search</Button>
        {isLoading && <Loader variation="linear" ariaLabel="Loading profiles..." />}
        {error && <Message type="error">{error}</Message>}
        {results.map((profile) => (
          <View key={profile.userId} border="1px solid #ccc" padding="1rem">
            <Text>{profile.firstName} {profile.lastNameInitial}</Text>
            <Text>{profile.email}</Text>
          </View>
        ))}
      </Flex>
    </View>
  );
};

export default SearchPage;