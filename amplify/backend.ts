import { defineBackend } from '@aws-amplify/backend';
import { userProfileFunction } from './functions/user-profile/resource';
import { schema as userProfileSchema } from './data/resource';
import { auth } from './auth/resource';
import { contactFunction } from './functions/contact/resource';


defineBackend({
  data: userProfileSchema,
  functions: {
    userProfile: userProfileFunction,
    contact: contactFunction
  },
  auth
});
