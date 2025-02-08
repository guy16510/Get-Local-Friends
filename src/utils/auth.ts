/**
 * Fetch cognito id
 */
import { fetchAuthSession } from 'aws-amplify/auth';

export const getCognitoUserId = async (): Promise<string | null> => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString(); // ✅ Ensure it's a string

    if (idToken) {
      const payload = JSON.parse(atob(idToken.split('.')[1])); // Decode JWT payload
      return payload.sub; // ✅ Cognito User ID (sub)
    }

    return null;
  } catch (error) {
    console.error('Error fetching Cognito User ID:', error);
    return null;
  }
};