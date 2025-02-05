import { defineBackend } from '@aws-amplify/backend';
import { userProfileFunction } from './functions/user-profile/resource';
import { schema as userProfileSchema } from './data/resource';
import { auth } from './auth/resource';
import { handler as contactFunction } from './functions/contact/handler';

defineBackend({ //fix userProfile
  data: userProfileSchema,
  functions: {
    userProfile: userProfileFunction, // Ensure this is correctly defined
    contact: contactFunction
  },
  auth
});