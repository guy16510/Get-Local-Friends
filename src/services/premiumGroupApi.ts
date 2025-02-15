// import { post } from 'aws-amplify/api';
// Import your AWS API service if needed
import { callApi } from './awsApi';

/**
 * Calls the custom endpoint to add the current user to the "premium" group.
 */
export async function addUserToPremiumGroup(): Promise<void> {
  try {
    // Option 1: Using Amplify Gen 2 API directly
    // await post({
    //   apiName: 'myRestApi',
    //   path: '/premium',
    //   options: {
    //     body: {}
    //   }
    // });

    // Option 2: Using your custom callApi service

    await callApi(
      'your-api-endpoint/premium',  // Replace with your actual API endpoint
      'POST',
      {},
      true  // requiresAuth = true
    );
    

  } catch (error) {
    console.error('Error adding user to premium group:', error);
    throw error;
  }
}
