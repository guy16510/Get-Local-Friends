import { useState, useEffect } from 'react';
import * as API from '@aws-amplify/api-rest';

const TestPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { response } = API.get({
          apiName: 'myRestApi',
          path: 'items'
        });
        const res = await response;
        const json = await res.body.json();
        setData(json);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data from API');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>API Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TestPage;