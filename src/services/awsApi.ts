import { fetchAuthSession } from 'aws-amplify/auth';
// import { generateClient } from 'aws-amplify/api';

// Define an interface for the temporary AWS credentials
export interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: Date;
}

/**
 * Retrieves (and caches) temporary AWS credentials from Cognito Identity Pools.
 */
export const getAWSCredentials = async (): Promise<AWSCredentials> => {
  try {
    const session = await fetchAuthSession();
    
    if (!session.credentials?.accessKeyId || 
        !session.credentials?.secretAccessKey || 
        !session.credentials?.sessionToken || 
        !session.credentials?.expiration) {
      throw new Error('Incomplete credentials received');
    }

    return {
      accessKeyId: session.credentials.accessKeyId,
      secretAccessKey: session.credentials.secretAccessKey,
      sessionToken: session.credentials.sessionToken,
      expiration: new Date(session.credentials.expiration),
    };
  } catch (error) {
    console.error('Error getting AWS credentials:', error);
    throw error;
  }
};

export async function callApi(
  url: string,
  method: string = 'GET',
  data?: any,
  requiresAuth: boolean = true
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    try {
      // Get both session token and AWS credentials
      const [session, credentials] = await Promise.all([
        fetchAuthSession(),
        getAWSCredentials()
      ]);

      if (!session.tokens?.idToken) {
        throw new Error('No ID token available');
      }

      // Add both token and AWS credentials
      headers['Authorization'] = session.tokens.idToken.toString();
      headers['x-amz-security-token'] = credentials.sessionToken;
      headers['x-amz-access-token'] = credentials.accessKeyId;
      headers['x-amz-secret-key'] = credentials.secretAccessKey;
    } catch (error) {
      console.error('Error retrieving auth credentials:', error);
      throw error;
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}


// Optional: If you're using API Gateway through Amplify, you can use the generated client
// const client = generateClient();
