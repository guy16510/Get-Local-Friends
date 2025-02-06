// src/components/SearchPage.tsx
import React, { useState } from 'react';
import {
  Button,
  Flex,
  Heading,
  TextField,
  SwitchField,
  View,
  Text,
} from '@aws-amplify/ui-react';
// Import API from the modular package
import API from '@aws-amplify/api-rest';

// Define a type for user profiles (adjust fields as needed)
export interface UserProfile {
  userId: string;
  firstName: string;
  lastNameInitial: string;
  email: string;
  zipcode: string;
  kids: string;      // e.g., "yes" or "no"
  drinking: string;
  married: string;
  ageRange: string;
  // add other fields as needed...
}

// Define the expected shape of the search response
interface SearchResponse {
  items: UserProfile[];
  totalPages: number;
}

const PAGE_SIZE = 10;

const SearchPage: React.FC = () => {
  // Filter state
  const [zipcode, setZipcode] = useState<string>('');
  const [filterKids, setFilterKids] = useState<boolean>(false);
  const [filterDrinking, setFilterDrinking] = useState<boolean>(false);
  const [filterMarried, setFilterMarried] = useState<boolean>(false);
  const [filterPets, setFilterPets] = useState<boolean>(false);
  const [filterEmployed, setFilterEmployed] = useState<boolean>(false);

  // Results and pagination state
  const [results, setResults] = useState<UserProfile[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch profiles using the custom search API
  const fetchProfiles = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);

    // Build filters – our backend expects string values.
    const filters: { [key: string]: string } = {};
    if (zipcode.trim()) filters.zipcode = zipcode.trim();
    if (filterKids) filters.kids = 'yes';
    if (filterDrinking) filters.drinking = 'yes';
    if (filterMarried) filters.married = 'yes';
    if (filterPets) filters.pets = 'yes';
    if (filterEmployed) filters.employed = 'yes';

    try {
      // Use the new API.post call with a single options object.
      const response = (await API.post({
        apiName: 'UserProfileApi',
        path: '/search',
        body: {
          query: filters,
          page,
          pageSize: PAGE_SIZE,
        },
      } as any)) as unknown as SearchResponse;
      // Expected response shape: { items: UserProfile[], totalPages: number }
      setResults(response.items);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || 'Error fetching profiles');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for the search button click
  const handleSearch = () => {
    // Reset to page 1 and fetch profiles
    fetchProfiles(1);
  };

  // Pagination handlers
  const goToPrevPage = () => {
    if (currentPage > 1) {
      fetchProfiles(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      fetchProfiles(currentPage + 1);
    }
  };

  return (
    <View padding="2rem">
      <Heading level={1}>Find People Near You</Heading>

      {/* Search Filters */}
      <Flex direction="column" gap="1rem" marginBottom="2rem">
        <TextField
          label="Zipcode"
          placeholder="Enter zipcode"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
        />
        <Flex direction="row" gap="1rem" wrap="wrap">
          <SwitchField
            label="Have Kids"
            isChecked={filterKids}
            onChange={(e) => setFilterKids(e.target.checked)}
          />
          <SwitchField
            label="Drink Alcohol"
            isChecked={filterDrinking}
            onChange={(e) => setFilterDrinking(e.target.checked)}
          />
          <SwitchField
            label="Married"
            isChecked={filterMarried}
            onChange={(e) => setFilterMarried(e.target.checked)}
          />
          <SwitchField
            label="Have Pets"
            isChecked={filterPets}
            onChange={(e) => setFilterPets(e.target.checked)}
          />
          <SwitchField
            label="Employed"
            isChecked={filterEmployed}
            onChange={(e) => setFilterEmployed(e.target.checked)}
          />
        </Flex>
        {/* Search button to trigger the search */}
        <Button onClick={handleSearch} variation="primary">
          Search
        </Button>
      </Flex>

      {/* Results Table */}
      <View overflow="auto" maxHeight="400px" marginBottom="1rem">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f0f0f0' }}>
            <tr>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Name</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Email</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Zipcode</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Kids</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Married</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Age Range</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>
                  Loading...
                </td>
              </tr>
            ) : results.length > 0 ? (
              results.map((profile) => (
                <tr key={profile.userId}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                    {profile.firstName} {profile.lastNameInitial}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                    {profile.email}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                    {profile.zipcode}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                    {profile.kids}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                    {profile.married}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                    {profile.ageRange}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>
                  No profiles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </View>

      {/* Pagination Controls */}
      <Flex justifyContent="space-between" alignItems="center">
        <Button onClick={goToPrevPage} disabled={currentPage === 1}>
          Prev
        </Button>
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </Flex>

      {error && (
        <Text color="red" marginTop="1rem">
          {error}
        </Text>
      )}
    </View>
  );
};

export default SearchPage;

//todo update this apge.