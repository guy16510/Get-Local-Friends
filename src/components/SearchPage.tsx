// src/components/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  Heading,
  TextField,
  SwitchField,
  View,
  Text,
  Message,
  Loader,
} from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
// import type { Schema } from '../../amplify/data/resource';
// import { generateClient } from 'aws-amplify/data';

// Import DynamoDB Geo classes.
import { GeoDataManager, GeoDataManagerConfiguration } from 'dynamodb-geo';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
// We'll use the raw DynamoDBClient rather than the DocumentClient
// because the Geo library needs a client with a native query method.


// Define a custom interface for the geo query result.
interface GeoQueryResult<T> {
  items: T[];
  nextToken?: string;
}

// Update UserProfile type to include geospatial fields.
// Zipcode remains a string to preserve leading zeros.
export interface UserProfile {
  id: string | null;
  userId: string;
  firstName: string;
  lastNameInitial: string;
  email: string;
  lookingFor: string;
  kids: string;
  zipcode: string;
  drinking: string;
  lat: number;
  lng: number;
  hobbies: (string | null)[];
  availability: (string | null)[];
  married: string | null;
  ageRange: string;
  friendAgeRange: string;
  pets: string;
  employed: string;
  work: string;
  political?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

const PAGE_SIZE = 10;
// const client = generateClient<Schema>();

// --- Configure DynamoDB Geo ---
// Use the low-level DynamoDBClient here.
const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const geoConfig = new GeoDataManagerConfiguration(
  ddbClient,
   'GeoUserProfileTable'
);
geoConfig.hashKeyLength = 3; // adjust as needed
const geoDataManager = new GeoDataManager(geoConfig);

// --- SessionStorage keys ---
const STORAGE_KEYS = {
  lat: 'search_latitude',
  lng: 'search_longitude',
  radius: 'search_radius',
  filters: 'search_filters',
  results: 'search_results',
  nextToken: 'search_nextToken',
  currentPage: 'search_currentPage',
};

const SearchPage: React.FC = () => {
  const navigate = useNavigate();

  // Geospatial search input state
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [radius, setRadius] = useState<string>('5000'); // default radius in meters

  // Optional zipcode input
  const [zipcode, setZipcode] = useState<string>('');

  // Advanced filters toggle and state.
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [filterKids, setFilterKids] = useState<boolean>(false);
  const [filterDrinking, setFilterDrinking] = useState<boolean>(false);
  const [filterMarried, setFilterMarried] = useState<boolean>(false);
  const [filterPets, setFilterPets] = useState<boolean>(false);
  const [filterEmployed, setFilterEmployed] = useState<boolean>(false);

  // Results, pagination, and error state.
  const [results, setResults] = useState<UserProfile[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Restore persisted state on mount.
  useEffect(() => {
    const storedLat = sessionStorage.getItem(STORAGE_KEYS.lat);
    const storedLng = sessionStorage.getItem(STORAGE_KEYS.lng);
    const storedRad = sessionStorage.getItem(STORAGE_KEYS.radius);
    const storedFilters = sessionStorage.getItem(STORAGE_KEYS.filters);
    const storedResults = sessionStorage.getItem(STORAGE_KEYS.results);
    const storedNextToken = sessionStorage.getItem(STORAGE_KEYS.nextToken);
    const storedPage = sessionStorage.getItem(STORAGE_KEYS.currentPage);

    if (storedLat) setLatitude(storedLat);
    if (storedLng) setLongitude(storedLng);
    if (storedRad) setRadius(storedRad);
    if (storedFilters) {
      try {
        const parsed = JSON.parse(storedFilters);
        setFilterKids(!!parsed.filterKids);
        setFilterDrinking(!!parsed.filterDrinking);
        setFilterMarried(!!parsed.filterMarried);
        setFilterPets(!!parsed.filterPets);
        setFilterEmployed(!!parsed.filterEmployed);
      } catch {}
    }
    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults));
      } catch {}
    }
    if (storedNextToken) setNextToken(storedNextToken);
    if (storedPage) setCurrentPage(Number(storedPage));
  }, []);

  // Persist state changes.
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.lat, latitude);
  }, [latitude]);
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.lng, longitude);
  }, [longitude]);
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.radius, radius);
  }, [radius]);
  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEYS.filters,
      JSON.stringify({ filterKids, filterDrinking, filterMarried, filterPets, filterEmployed })
    );
  }, [filterKids, filterDrinking, filterMarried, filterPets, filterEmployed]);
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.results, JSON.stringify(results));
  }, [results]);
  useEffect(() => {
    if (nextToken) {
      sessionStorage.setItem(STORAGE_KEYS.nextToken, nextToken);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.nextToken);
    }
  }, [nextToken]);
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.currentPage, currentPage.toString());
  }, [currentPage]);

  // Auto-clear error messages after 5 seconds.
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Helper: apply extra filters on the client side.
  const applyExtraFilters = (items: UserProfile[]): UserProfile[] => {
    let filtered = items;
    if (filterKids) filtered = filtered.filter((item) => item.kids === 'yes');
    if (filterDrinking) filtered = filtered.filter((item) => item.drinking === 'yes');
    if (filterMarried) filtered = filtered.filter((item) => item.married === 'yes');
    if (filterPets) filtered = filtered.filter((item) => item.pets === 'yes');
    if (filterEmployed) filtered = filtered.filter((item) => item.employed === 'yes');
    return filtered;
  };

  // Use HTML5 geolocation to get user's current location.
  const useMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        () => {
          setError('Unable to retrieve your location.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  // Fetch profiles using geospatial query via dynamodb-geo.
  const fetchProfilesByGeo = async (page: number = 1, token?: string) => {
    setIsLoading(true);
    setError(null);

    const trimmedLat = latitude.trim();
    const trimmedLng = longitude.trim();
    const trimmedRad = radius.trim();

    if (!trimmedLat || !trimmedLng || !trimmedRad) {
      setError('Please enter latitude, longitude, and radius.');
      setIsLoading(false);
      return;
    }

    const latNum = parseFloat(trimmedLat);
    const lngNum = parseFloat(trimmedLng);
    const radNum = parseFloat(trimmedRad);
    if (isNaN(latNum) || isNaN(lngNum) || isNaN(radNum)) {
      setError('Invalid latitude, longitude, or radius. Please enter only numbers.');
      setIsLoading(false);
      return;
    }

    try {
      const radiusQueryInput: any = {
        RadiusInMeter: radNum,
        CenterPoint: { latitude: latNum, longitude: lngNum },
        Limit: PAGE_SIZE,
      };
      if (token) {
        radiusQueryInput.nextToken = token;
      }

      // Cast the response to our custom GeoQueryResult interface.
      const geoResponse = (await geoDataManager.queryRadius(radiusQueryInput)) as unknown as GeoQueryResult<UserProfile>;
      setNextToken(geoResponse.nextToken || null);

      const newItems: UserProfile[] = geoResponse.items;
      const filteredItems = applyExtraFilters(newItems);

      setResults((prev) => (page === 1 ? filteredItems : [...prev, ...filteredItems]));
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || 'Error fetching geospatial profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setNextToken(null);
    setResults([]);
    fetchProfilesByGeo(1);
  };

  const goToNextPage = () => {
    if (nextToken) {
      fetchProfilesByGeo(currentPage + 1, nextToken);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setNextToken(null);
      fetchProfilesByGeo(1);
    }
  };

  // Navigate to ProfilePage with selected profile.
  const handleRowClick = (profile: UserProfile) => {
    navigate('/profile', { state: { profile } });
  };

  // Toggle advanced filters section.
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters((prev) => !prev);
  };

  return (
    <View padding="2rem">
      <Heading level={1}>Find People Near You</Heading>

      {/* Search Inputs */}
      <Flex direction="column" gap="1rem" marginBottom="2rem">
        <Flex direction="row" gap="1rem">
          <TextField
            ariaLabel="Latitude"
            label="" // no visible label
            placeholder="Enter latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
          <TextField
            ariaLabel="Longitude"
            label=""
            placeholder="Enter longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
          <Button onClick={useMyLocation} variation="primary">
            Use My Location
          </Button>
        </Flex>
        <TextField
          ariaLabel="Radius in meters"
          label=""
          placeholder="Enter radius (e.g., 5000)"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        />
        <TextField
          ariaLabel="Zipcode (optional)"
          label=""
          placeholder="Enter zipcode (numbers only)"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
        />
        <Button onClick={toggleAdvancedFilters} variation="primary">
          {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
        </Button>
        <div
          style={{
            maxHeight: showAdvancedFilters ? '200px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease-out',
          }}
        >
          <Flex direction="row" gap="1rem" wrap="wrap" marginTop="1rem">
            <SwitchField
              ariaLabel="Have Kids"
              label=""
              isChecked={filterKids}
              onChange={(e) => setFilterKids(e.target.checked)}
            />
            <SwitchField
              ariaLabel="Drink Alcohol"
              label=""
              isChecked={filterDrinking}
              onChange={(e) => setFilterDrinking(e.target.checked)}
            />
            <SwitchField
              ariaLabel="Married"
              label=""
              isChecked={filterMarried}
              onChange={(e) => setFilterMarried(e.target.checked)}
            />
            <SwitchField
              ariaLabel="Have Pets"
              label=""
              isChecked={filterPets}
              onChange={(e) => setFilterPets(e.target.checked)}
            />
            <SwitchField
              ariaLabel="Employed"
              label=""
              isChecked={filterEmployed}
              onChange={(e) => setFilterEmployed(e.target.checked)}
            />
          </Flex>
        </div>
        <Button onClick={handleSearch} variation="primary">
          Search
        </Button>
      </Flex>

      {/* Status Message */}
      {error && <Message variation="filled" className="error-message">{error}</Message>}

      {/* Loader */}
      {isLoading && (
        <Loader
          variation="linear"
          ariaLabel="Loading profiles..."
          style={{ width: '100%', height: '4rem', marginBottom: '1rem' }}
        />
      )}

      {/* Results Table */}
      {!isLoading && results.length > 0 && (
        <View overflow="auto" maxHeight="400px" marginBottom="1rem">
          <table className="search-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--amplify-colors-neutral-60)' }}>
              <tr>
                <th style={{ padding: '0.5rem', border: '1px solid var(--amplify-colors-neutral-40)' }}>Name</th>
                <th style={{ padding: '0.5rem', border: '1px solid var(--amplify-colors-neutral-40)' }}>Email</th>
                <th style={{ padding: '0.5rem', border: '1px solid var(--amplify-colors-neutral-40)' }}>Zipcode</th>
                <th style={{ padding: '0.5rem', border: '1px solid var(--amplify-colors-neutral-40)' }}>Kids</th>
                <th style={{ padding: '0.5rem', border: '1px solid var(--amplify-colors-neutral-40)' }}>Married</th>
                <th style={{ padding: '0.5rem', border: '1px solid var(--amplify-colors-neutral-40)' }}>Age Range</th>
              </tr>
            </thead>
            <tbody>
              {results.map((profile) => (
                <tr key={profile.userId || 'unknown'} onClick={() => handleRowClick(profile)} style={{ cursor: 'pointer' }}>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--amplify-colors-neutral-40)' }}>
                    {profile.firstName} {profile.lastNameInitial}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--amplify-colors-neutral-40)' }}>
                    {profile.email}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--amplify-colors-neutral-40)' }}>
                    {profile.zipcode}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--amplify-colors-neutral-40)' }}>
                    {profile.kids}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--amplify-colors-neutral-40)' }}>
                    {profile.married}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--amplify-colors-neutral-40)' }}>
                    {profile.ageRange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </View>
      )}

      {/* Pagination Controls */}
      <Flex justifyContent="space-between" alignItems="center">
        <Button onClick={goToPrevPage} disabled={currentPage === 1}>
          Prev
        </Button>
        <Text>
          Page {currentPage} {nextToken ? `(more available)` : `(last page)`}
        </Text>
        <Button onClick={goToNextPage} disabled={!nextToken}>
          Next
        </Button>
      </Flex>
    </View>
  );
};

export default SearchPage;