export const fetchData = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Fetch Error:', error);
      throw error;
    }
  };
  
  export const postData = async (url: string, data: any) => {
    return fetchData(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };